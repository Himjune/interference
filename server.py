import os.path
import json
from datetime import datetime

from flask import Flask, Response, request, jsonify

from flask import send_from_directory

app = Flask(__name__)
@app.route('/results/<uuid>', methods=['POST'])
def results(uuid):
    dt = datetime.now()
    with open('./reports/'+uuid+dt.strftime("-%H%M%S%f")+'.json', 'w') as f:
        json.dump(request.json, f)

    return jsonify({"uuid": uuid})

@app.route('/<path:path>')
def serve_html(path):
    if path == "pamyat": path = "pamyat.html"
    # Using request args for path will expose you to directory traversal attacks
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port="80", debug=True)