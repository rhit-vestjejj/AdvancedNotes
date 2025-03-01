# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    stuff = data.get("text")
    date = data.get("date")
    # Implement your authentication logic here
    with open(f"backend/notes/{date}.txt", 'w') as f:
        f.write(stuff)
    return jsonify({"message": f"Message: {stuff} in {date}.txt"}), 200

if __name__ == '__main__':
    app.run(debug=True)
