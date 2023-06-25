import json
import os
from dataclasses import dataclass

from dotenv import load_dotenv
from embeddings import metadata_field_info, vector_store
from langchain import PromptTemplate
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.retrievers import SelfQueryRetriever

# Load environment variables from .env file
load_dotenv()

OPEN_AI_KEY = os.getenv("OPEN_AI_KEY", "")
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


def load_template_from_file(filepath, variables):
    try:
        with open(filepath, "r") as file:
            template_str = file.read()
        return template_str.format(**{var: "{" + var + "}" for var in variables})
    except Exception as e:
        print(f"Failed to load template from file: {filepath}")
        print(f"Error: {e}")
        raise


def run_llm_chain(template_str, **kwargs):
    prompt = PromptTemplate(template=template_str, input_variables=list(kwargs.keys()))
    llm_chain = LLMChain(prompt=prompt, llm=LLM)
    return llm_chain.run(**kwargs)


def raja_agent(req_body):
    card = Card(**req_body)
    file, metadata = {}, {}

    document_description = "Stores the code in the file"

    retriever = SelfQueryRetriever.from_llm(
        LLM, vector_store, document_description, metadata_field_info, verbose=True
    )

    get_relevant_file_paths = load_template_from_file(
        "server/prompts/get_relevant_files.txt",
        ["description", "label", "how_to_reproduce", "acceptance_criteria"],
    )

    relevant_file_paths = retriever.get_relevant_documents(get_relevant_file_paths)

    for file in relevant_file_paths:
        print(file.metadata["document_id"])
        # with open("data/content.txt", "w") as f:
        #     f.write(file.page_conent)

    for template_name, variables in TEMPLATE_VARIABLES[card.type].items():
        kwargs = {var: getattr(card, var, "") for var in variables}
        template_str = load_template_from_file(
            TEMPLATE_FILEPATHS[card.type][template_name], variables
        )

        if template_name == card.type:
            file["new_code"] = run_llm_chain(template_str, **kwargs)
        else:
            metadata[template_name] = run_llm_chain(template_str, **kwargs)

    with open("data/file_path.json", "w") as f:
        json.dump(file, f, indent=4)

    return file, metadata
