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

# Load environment variables from .env file
load_dotenv()

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

    pd.DataFrame.from_records(corpus_summary).to_csv(
        "data/corpus_summary.csv", index=False
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
    path_parts = parsed_url.path.split("/")

    # The repo name is the last part of the path
    repo_name = path_parts[-1]

    # The owner is the second-to-last part of the path
    owner = path_parts[-2]

    return owner, repo_name


import os
from pprint import pprint

import embeddings
import raja
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from ghapi.all import GhApi

from convex import ConvexClient

app = Flask("Raja")
cors = CORS(app)

# get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# go up one level to get the root directory
root_dir = os.path.dirname(current_dir)

dotenv_path = os.path.join(root_dir, ".env.local")

# load the .env file
load_dotenv(dotenv_path)

client = ConvexClient(os.getenv("NEXT_PUBLIC_CONVEX_URL"))
GH_TOKEN = os.getenv("GH_TOKEN", "")


@app.route("/v1/initialize-repo", methods=["POST"])
@cross_origin()
def initialize_repo():
    req_data = request.get_json()
    user_id = req_data["user_id"]
    user_email = req_data["user_email"]
    repo_url = req_data["repo_url"]


    try:
        folder_path, zip_url = embeddings.compute_prefix_and_zip_url(repo_url)
        embeddings.execute_embedding_workflow(zip_url, folder_path)
        repo_owner, repo_name = embeddings.get_repo_info(repo_url)
        client.mutation(
            "repo:addRepo", {"user_id": user_id, "user_email": user_email, "url": repo_url, "owner": "repo_owner", "name": "repo_name"}
        )
    except ValueError as e:
        return jsonify(error=str(e)), 400
    return jsonify(message="Embedding workflow executed successfully"), 200


@app.route("/v1/run-raja", methods=["POST"])
def run_raja():
    print("Running Raja")
    req_data = request.get_json()
    print(req_data)
    raja.raja_agent(req_data)
    return jsonify(message="Raja workflow executed successfully"), 200


@app.route("/v1/delete-all-except-main", methods=["POST"])
def delete_all_except_main():
    req_data = request.get_json()
    repo_owner = req_data["repo_owner"]
    repo_name = req_data["repo_name"]
    ghapi = GhApi(owner=repo_owner, repo=repo_name, token=GH_TOKEN)

    # Get all branches
    branches = ghapi.repos.list_branches()

    for branch in branches:
        # Delete the branch if its name is not 'main'
        if branch.name != "main":
            try:
                ghapi.git.delete_ref(ref=f"heads/{branch.name}")
                print(f"Deleted branch: {branch.name}")
            except Exception as e:
                print(f"Error deleting branch {branch.name}: {e}")

    return {}


@app.route("/v1/get-tickets", methods=["GET"])
def get_tickets():
    tickets = client.query("tickets:get")
    print(tickets)
    return tickets


@app.route("/v1/create-ticket", methods=["POST"])
def create_ticket():
    req_data = request.get_json()
    print(req_data)
    client.mutation("tickets:createTicket", req_data)
    return {}


if __name__ == "__main__":
    app.run(port=5000, debug=True)