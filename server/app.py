import embeddings
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask("Raja")
CORS(app)  # This will enable CORS for all routes


@app.route("/v1/initialize-repo", methods=["POST"])
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
    req_data = request.get_json()


if __name__ == "__main__":
    app.run(port=5000, debug=True)
