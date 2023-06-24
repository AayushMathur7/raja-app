import json
import os
from dataclasses import dataclass, field

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
        "pr_title": ["name", "label", "description", "acceptance_criteria"],
        "pr_body": ["name", "label", "description", "acceptance_criteria"],
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
    name: str = field(default=None)
    label: str = field(default=None)
    description: str = field(default=None)
    acceptance_criteria: str = field(default=None)
    how_to_reproduce: str = field(default=None)


def load_template_from_file(filepath, variables):
    with open(filepath, "r") as file:
        template_str = file.read()
    return template_str.format(**{var: "{" + var + "}" for var in variables})


def run_llm_chain(template_str, **kwargs):
    prompt = PromptTemplate(template=template_str, input_variables=list(kwargs.keys()))
    llm_chain = LLMChain(prompt=prompt, llm=LLM)
    return llm_chain.run(**kwargs)


def raja_agent(req_body):
    card = Card(**req_body)
    file, metadata = {}, {}

    # document_description = "Stores the code in the file"
    #
    # retriever = SelfQueryRetriever.from_llm(
    #     LLM, vector_store, document_description, metadata_field_info, verbose=True
    # )
    #
    # print(retriever.get_relevant_documents(card.description))

    for template_name, variables in TEMPLATE_VARIABLES[card.type].items():
        kwargs = {var: getattr(card, var, None) for var in variables}
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
