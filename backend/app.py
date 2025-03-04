# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import date
import os
from backend.model_talk import talk_ai


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/send_notes', methods=['POST'])
def send_notes():
    data = request.get_json()
    stuff = data.get("text")
    name = request.args.get('date') if request.args.get('date') != None else date.today()
    # Implement your authentication logic here
    with open(f"backend/notes/{name}.txt", 'w') as f:
        f.write(stuff)

    if stuff.strip() == "New note":
        remove_note(name)
    
    return jsonify({"message": f"Message: {stuff} in {name}.txt"}), 200

@app.route('/api/get_notes', methods=['GET'])
def get_notes():
    name = request.args.get('date') if request.args.get('date') != None else date.today()
    prevdate = request.args.get('prevDate') if request.args.get('prevDate') != None else date.today()

    if not os.path.exists(f"backend/notes/{name}.txt"):
        create_note(name)
    
    try:
        with open(f"backend/notes/{prevdate}.txt", 'r') as f:
            content = f.read()
        if content == "New note" or content == "":
            remove_note(prevdate)
    except Exception as ex:
        print(str(ex))

    with open(f"backend/notes/{name}.txt", 'r') as f:
        content = f.read()

    return jsonify({"content": content}), 200

@app.route('/api/send_chat', methods = ['POST'])
def send_chat():
    data = request.get_json()
    message = data.get("message")

    response = talk_ai(message)

    return jsonify({"content": response}), 200

def create_note(name):
    with open(f"backend/notes/{name}.txt", 'w') as f:
        f.write("New note")

def remove_note(name):
    if os.path.exists(f"backend/notes/{name}.txt"):
            os.remove(f"backend/notes/{name}.txt")

@app.route('/api/get_all_notes', methods = ['GET'])
def send_all_chats():
    allNotes = []

    for filename in os.listdir("backend/notes"):
        allNotes.append(filename.replace(".txt", ""))

    return jsonify({"content" : allNotes})
    

if __name__ == '__main__':
    app.run(debug=True)
