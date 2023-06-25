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
            "repo:addRepo",
            {
                "user_id": user_id,
                "user_email": user_email,
                "url": repo_url,
                "owner": repo_owner,
                "name": repo_name,
            },
        )
    except ValueError as e:
        return jsonify(error=str(e)), 400
    return jsonify(message="Embedding workflow executed successfully"), 200


@app.route("/v1/run-raja", methods=["POST"])
def run_raja():
    print("Running Raja")
    req_data = request.get_json()
    print(req_data)
    try:
        raja.raja_agent(req_data)
        return jsonify(message="Raja workflow executed successfully"), 200
    except Exception as e:
        return jsonify(error=str(e)), 400


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