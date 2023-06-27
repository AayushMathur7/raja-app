import os
import logging

import embeddings
import raja
from celery import Celery
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from ghapi.all import GhApi

from convex import ConvexClient

app = Flask("Raja")
cors = CORS(app)

# Initialize Celery
celery = Celery(
    app.name,
    broker=os.environ["CLOUDAMQP_URL"],
    backend=os.environ["REDIS_URL"],
)

# get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# go up one level to get the root directory
root_dir = os.path.dirname(current_dir)

dotenv_path = os.path.join(root_dir, ".env.local")

# load the .env file
load_dotenv(dotenv_path)

client = ConvexClient(os.getenv("NEXT_PUBLIC_CONVEX_URL"))
GH_TOKEN = os.getenv("GH_TOKEN", "")

# Configure logging
logging.basicConfig(filename='app.log', level=logging.DEBUG,
                    format='%(asctime)s %(levelname)s %(message)s')

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
        logging.info("Embedding workflow completed successfully")
    except ValueError as e:
        logging.error(f"Error in embedding workflow: {str(e)}")
        return jsonify(error=str(e)), 400
    return jsonify(message="Embedding workflow executed successfully"), 200


@app.route("/v1/run-raja", methods=["POST"])
def run_raja():
    logging.info("Running Raja")
    req_data = request.get_json()
    logging.debug(req_data)
    try:
        task = run_raja_task.delay(req_data)  # This will now run as a Celery task
        return (
            jsonify(message="Raja workflow initiated successfully", task_id=task.id),
            200,
        )
    except Exception as e:
        logging.error(f"Error in Raja workflow: {str(e)}")
        return jsonify(error=str(e)), 400


@celery.task
def run_raja_task(req_data):
    pr_url = raja.raja_agent(req_data)
    return pr_url


@app.route("/v1/tasks/<task_id>", methods=["GET"])
def get_task_status(task_id):
    task = celery.AsyncResult(task_id)
    response = {"task_id": task.id, "status": task.status}
    if task.status == "SUCCESS":
        response["result"] = task.result  # This is where you could return the PR URL
    return jsonify(response)


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
                logging.info(f"Deleted branch: {branch.name}")
            except Exception as e:
                logging.error(f"Error deleting branch {branch.name}: {e}")

    return {}


@app.route("/v1/get-tickets", methods=["GET"])
def get_tickets():
    tickets = client.query("tickets:get")
    logging.debug(tickets)
    return tickets


@app.route("/v1/create-ticket", methods=["POST"])
def create_ticket():
    req_data = request.get_json()
    logging.debug(req_data)
    client.mutation("tickets:createTicket", req_data)
    return {}


if __name__ == "__main__":
    app.run(port=5000, debug=True)