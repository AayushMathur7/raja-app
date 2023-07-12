import os
import zipfile
from io import BytesIO
from urllib.parse import urlparse
from urllib.request import urlopen

import pandas as pd
import pinecone
import tiktoken
from dotenv import load_dotenv
from langchain.chains.query_constructor.schema import AttributeInfo
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone
from tqdm import tqdm

# get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# go up one level to get the root directory
root_dir = os.path.dirname(current_dir)

dotenv_path = os.path.join(root_dir, ".env.local")

# load the .env file
load_dotenv(dotenv_path)

GH_TOKEN = os.environ.get("GH_TOKEN", "")
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY", "")
PINECONE_ENVIRONMENT = os.environ.get("PINECONE_ENVIRONMENT", "dev")
OPEN_AI_KEY = os.environ.get("OPEN_AI_KEY", "")

embeddings = OpenAIEmbeddings(
    openai_api_key=OPEN_AI_KEY,
)
encoder = tiktoken.get_encoding("cl100k_base")
pinecone.init(
    api_key=PINECONE_API_KEY,
    environment=PINECONE_ENVIRONMENT,
)
vector_store = Pinecone(
    index=pinecone.Index("raja-app"),
    embedding_function=embeddings.embed_query,
    text_key="text",
    namespace="raja-app",
)
metadata_field_info = [
    AttributeInfo(
        name="document_id",
        description="The file path where the code is stored",
        type="string",
    ),
]


def execute_embedding_workflow(repo_url, folder_path):
    print("Executing embedding workflow")
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)

    total_tokens, corpus_summary = 0, []
    file_texts, metadatas = [], []
    # Assumes that the repo is public
    with zipfile_from_github(repo_url) as zip_ref:
        print("Extracting zip file")
        zip_file_list = zip_ref.namelist()

        pbar = tqdm(zip_file_list, desc=f"Total tokens: 0")
        for file_name in pbar:
            print(file_name)
            if (
                file_name.endswith("/")
                or any(
                    f in file_name
                    for f in [".DS_Store", ".gitignore", ".next", ".json"]
                )
                or any(
                    file_name.endswith(ext)
                    for ext in [".png", ".jpg", ".jpeg", ".svg", ".ico"]
                )
            ):
                continue
            else:
                with zip_ref.open(file_name, "r") as file:
                    file_contents = str(file.read())
                    file_name_trunc = str(file_name).replace(folder_path, "")

                    n_tokens = len(encoder.encode(file_contents))
                    total_tokens += n_tokens
                    corpus_summary.append(
                        {"file_name": file_name_trunc, "n_tokens": n_tokens}
                    )

                    file_texts.append(file_contents)
                    metadatas.append({"document_id": file_name_trunc})
                    pbar.set_description(f"Total tokens: {total_tokens}")

    split_documents = splitter.create_documents(file_texts, metadatas=metadatas)
    vector_store.from_documents(
        documents=split_documents,
        embedding=embeddings,
        index_name="raja-app",
        namespace="raja-app",
    )

    print("Embedding workflow executed successfully")
    return {}


def embed_document(vector_db, splitter, document_id, document):
    metadata = [{"document_id": document_id}]
    split_documents = splitter.create_documents([str(document)], metadatas=metadata)

    texts = [d.page_content for d in split_documents]
    metadatas = [d.metadata for d in split_documents]

    docsearch = vector_db.add_texts(texts, metadatas=metadatas)


# Only for public repos
def zipfile_from_github(repo_url):
    http_response = urlopen(repo_url)
    zf = BytesIO(http_response.read())
    return zipfile.ZipFile(zf, "r")


def compute_prefix_and_zip_url(repo_url, main_branch="main"):
    parsed = urlparse(repo_url)
    if not all([parsed.scheme, parsed.netloc]):
        raise ValueError("Invalid URL: " + repo_url)

    path_parts = parsed.path.strip("/").split("/")
    repo_name = path_parts[-1] if parsed.path.endswith(".git") else path_parts[-2]
    if not repo_name:
        raise ValueError("Invalid repository URL: " + repo_url)

    folder_prefix = f"{repo_name}-{main_branch}"

    # Ensure that the URL is a GitHub repository URL
    if parsed.netloc != "github.com":
        raise ValueError("Invalid GitHub repository URL")

    # Extract the username and repository name
    if len(path_parts) < 2:
        raise ValueError("Invalid GitHub repository URL")

    username = path_parts[0]
    repo = path_parts[1]

    # Construct the .zip file URL
    zip_url = (
        f"https://github.com/{username}/{repo}/archive/refs/heads/{main_branch}.zip"
    )

    return folder_prefix, zip_url


def get_repo_info(url):
    # Parse the URL and split the path
    parsed_url = urlparse(url)
    path_parts = parsed_url.path.strip("/").split("/")

    # The repo name is the last part of the path
    repo_name = path_parts[-1]

    # The owner is the second-to-last part of the path
    owner = path_parts[-2]

    return owner, repo_name


def create_github_pull_request(ghapi_client, ghapi_raja_client, file, metadata):
    repo_info = ghapi_client.repos.get()
    repo_name = repo_info.name
    repo_owner = repo_info.owner.login

    branch_name = metadata["branch_name"]
    pr_title = metadata["pr_title"]
    pr_body = metadata["pr_body"]
    pr_commit_message = metadata["pr_commit_message"]

    # Create a new branch
    ghapi_client.git.create_ref(
        ref=f"refs/heads/{branch_name}", sha=repo_info.default_branch
    )

    # Commit and push the changes to the new branch
    for filepath, content in file.items():
        try:
            file_content = ghapi_client.repos.get_content(
                path=filepath, ref=branch_name
            )
            file_sha = file_content.sha
            ghapi_client.repos.update_file(
                path=filepath,
                message=pr_commit_message,
                content=content,
                sha=file_sha,
                branch=branch_name,
            )
        except Exception as e:
            print(f"Failed to update file: {filepath}")
            print(f"Error: {e}")

    # Create a pull request
    try:
        pr_response = ghapi_raja_client.pulls.create(
            title=pr_title, body=pr_body, head=branch_name, base=repo_info.default_branch
        )
        pr_url = pr_response.html_url
        print("Pull request created:", pr_url)
        return pr_url
    except Exception as e:
        print("Failed to create pull request")
        print(f"Error: {e}")
        return None


def raja_agent(details):
    card = Card(**details)
    file = {}

    document_description = "Stores the code in the file"

    retriever = SelfQueryRetriever.from_llm(
        LLM, vector_store, document_description, metadata_field_info, verbose=True
    )

    # Determine the appropriate file path based on the card type
    if card.type == "bug":
        get_relevant_file_path = "prompts/get_relevant_files_bug.txt"
    elif card.type == "feature":
        get_relevant_file_path = "prompts/get_relevant_files_feature.txt"
    else:
        raise ValueError(f"Unsupported card type: {card.type}")

    get_relevant_file_paths = load_prompt_from_file(get_relevant_file_path, vars(card))

    print(get_relevant_file_paths)

    relevant_documents = retriever.get_relevant_documents(get_relevant_file_paths)

    for template_name, variables in TEMPLATE_VARIABLES[card.type].items():
        kwargs = {var: getattr(card, var, "") for var in variables}

        if template_name == card.type:
            file_objects = ""
            for document in relevant_documents:
                repo_info = client.query("repo:get")[0]
                repo_name = repo_info["name"]
                repo_owner = repo_info["owner"]
                ghapi_client = GhApi(owner=repo_owner, repo=repo_name, token=GH_TOKEN)
                ghapi_raja_client = GhApi(
                    owner=repo_owner, repo=repo_name, token=RAJA_TOKEN
                )
                file_path = document.metadata["document_id"]
                print(file_path)

                # Remove repository name from the file path if it is there
                repo_name_with_slash = f"{repo_name}-main/"
                truncated_file_path = file_path
                if file_path.startswith(repo_name_with_slash):
                    truncated_file_path = file_path.replace(repo_name_with_slash, "", 1)

                try:
                    commits = ghapi_client.repos.list_commits(path=truncated_file_path)
                except Exception as e:
                    print(f"Failed to get commits for file: {file_path}")
                    print(f"Error: {e}")
                    commits = None

                if commits:
                    latest_commit_sha = commits[0].sha
                    try:
                        file_content = ghapi_client.repos.get_content(
                            path=truncated_file_path, ref=latest_commit_sha
                        )
                        decoded_content = base64.b64decode(file_content.content).decode(
                            "utf-8"
                        )
                        num_lines = len(decoded_content.splitlines())

                        # Check if the file is too large
                        if num_lines > 1000:
                            print(f"File {file_path} is too large, skipping...")
                            relevant_documents.remove(document)
                            continue

                        file_objects += (
                            f"Code for the following {file_path}: \n {decoded_content} "
                        )
                    except Exception as e:
                        print(f"Failed to get file content for file: {file_path}")
                        print(f"Error: {e}")
                        continue
                else:
                    print(f"No commits found for file: {file_path}")

            kwargs["file_objects"] = file_objects

            file = generate_code(
                file, card.type, template_name, variables, relevant_documents, **kwargs
            )
        else:
            template_str = load_template_from_file(
                TEMPLATE_FILEPATHS[card.type][template_name], variables
            )
            metadata[template_name] = run_llm_chain(template_str, **kwargs)

    pull_request_url = create_github_pull_request(
        ghapi_client, ghapi_raja_client, file, metadata
    )

    return pull_request_url