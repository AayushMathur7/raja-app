from flask import Flask, jsonify

app = Flask(name)


@app.route('/v1/initialize-repo', methods=['GET'])
def initalize_repo():
    data = {'message': 'Hello, world!'}
    return jsonify(data)


if name == 'main':
    app.run(port=5000, debug=True)