import json
import os
from dataclasses import dataclass, field
from typing import Dict

from app import client
from dotenv import load_dotenv
from embeddings import metadata_field_info, vector_store
from ghapi.all import GhApi
from langchain import PromptTemplate
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.retrievers import SelfQueryRetriever

# Load environment variables from .env file
load_dotenv()

OPEN_AI_KEY = os.getenv("OPEN_AI_KEY", "")
GH_TOKEN = os.getenv("GH_TOKEN", "")
LLM = ChatOpenAI(
    openai_api_key=OPEN_AI_KEY, model_name="gpt-3.5-turbo-16k-0613", temperature=0.2
)

TEMPLATE_VARIABLES = {
    "bug": {
        "bug": [
            "name",
            "label",
            "description",
            "acceptance_criteria",
            "how_to_reproduce",
            "current_filepath",
            "file_objects",
        ],
        "branch_name": ["name", "label"],
        "pr_title": [
            "name",
            "label",
            "description",
            "how_to_reproduce",
            "acceptance_criteria",
        ],
        "pr_body": [
            "name",
            "label",
            "description",
            "how_to_reproduce",
            "acceptance_criteria",
        ],
    },
    "feature": {
        # define variables for feature here
    },
}

TEMPLATE_FILEPATHS = {
    "bug": {
        "bug": "server/prompts/tickets/bug_template.txt",
        "branch_name": "server/prompts/pr_branch_template.txt",
        "pr_title": "server/prompts/pr_title_template.txt",
        "pr_body": "server/prompts/pr_body_template.txt",
    },
    "feature": {
        # define file paths for feature here
    },
}


@dataclass
class Card:
    type: str
    name: str = ""
    label: str = ""
    description: str = ""
    acceptance_criteria: str = ""
    how_to_reproduce: str = ""
    current_filepath: str = ""
    file_objects: Dict = field(default_factory=dict)


def load_template_from_file(filepath, variables):
    try:
        with open(filepath, "r") as file:
            template_str = file.read()
        return template_str.format(**{var: "{" + var + "}" for var in variables})
    except Exception as e:
        print(f"Failed to load template from file: {filepath}")
        print(f"Error: {e}")
        raise


def load_prompt_from_file(filepath, variables):
    try:
        with open(filepath, "r") as file:
            template_str = file.read()
        return template_str.format(**variables)
    except Exception as e:
        print(f"Failed to load template from file: {filepath}")
        print(f"Error: {e}")
        raise


def run_llm_chain(template_str, **kwargs):
    prompt = PromptTemplate(template=template_str, input_variables=list(kwargs.keys()))
    llm_chain = LLMChain(prompt=prompt, llm=LLM)
    return llm_chain.run(**kwargs)


def generate_code(file, ticket_type, template_name, variables, documents, **kwargs):
    for document in documents:
        filepath = document.metadata["document_id"]
        kwargs["current_filepath"] = filepath
        template_str = load_template_from_file(
            TEMPLATE_FILEPATHS[ticket_type][template_name], variables
        )
        file[filepath] = run_llm_chain(template_str, **kwargs)
    print(file)
    return file


def raja_agent(req_body):
    card = Card(**req_body)
    file, metadata = {}, {}

    document_description = "Stores the code in the file"

    retriever = SelfQueryRetriever.from_llm(
        LLM, vector_store, document_description, metadata_field_info, verbose=True
    )

    get_relevant_file_paths = load_prompt_from_file(
        "server/prompts/get_relevant_files.txt", vars(card)
    )

    relevant_documents = retriever.get_relevant_documents(get_relevant_file_paths)

    for template_name, variables in TEMPLATE_VARIABLES[card.type].items():
        kwargs = {var: getattr(card, var, "") for var in variables}

        if template_name == card.type:
            file_objects = {}
            for document in relevant_documents:
                repo_info = client.query("repo:get")[0]
                repo_name = repo_info["name"]
                repo_owner = repo_info["owner"]
                ghapi_client = GhApi(owner=repo_owner, repo=repo_name, token=GH_TOKEN)
                file_path = document.metadata["document_id"]

                # Remove repository name from the file path if it is there
                repo_name_with_slash = f"{repo_name}-main/"
                if file_path.startswith(repo_name_with_slash):
                    file_path = file_path.replace(repo_name_with_slash, "", 1)

                commits = ghapi_client.repos.list_commits(path=file_path)

                if commits:
                    latest_commit_sha = commits[0].sha
                    print(latest_commit_sha)
                    file_objects[file_path] = ghapi_client.repos.get_content(
                        path=file_path, ref=latest_commit_sha
                    )
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

    with open("data/file_path.json", "w") as f:
        json.dump(file, f, indent=4)

    return file, metadata
