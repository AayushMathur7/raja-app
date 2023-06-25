import os
from pprint import pprint

import embeddings
import raja
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

from convex import ConvexClient

app = Flask("Raja")
cors = CORS(app)

# get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# go up one level to get the root directory
root_dir = os.path.dirname(current_dir)

dotenv_path = os.path.join(root_dir, ".env.local")

# load the .env file
print(dotenv_path)
load_dotenv(dotenv_path)

client = ConvexClient(os.getenv("NEXT_PUBLIC_CONVEX_URL"))


@app.route("/v1/initialize-repo", methods=["POST"])
@cross_origin()
def initalize_repo():
    req_data = request.get_json()
    repo_url = req_data["repo_url"]
    try:
        folder_path, zip_url = embeddings.compute_prefix_and_zip_url(repo_url)
        embeddings.execute_embedding_workflow(zip_url, folder_path)
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


@app.route("/v1/get-ticket", methods=["GET"])
def get_tickets():
    tickets = client.query("tickets:get")
    pprint(tickets)
    return tickets


@app.route("/v1/create-ticket", methods=["POST"])
def create_ticket():
    req_data = request.get_json()
    print(req_data)
    client.mutation("tickets:createTicket", req_data)
    return {}


if __name__ == "__main__":
    app.run(port=5000, debug=True)
