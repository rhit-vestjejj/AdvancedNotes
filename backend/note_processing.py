import os
from datetime import datetime

def load_notes(directory = "backend/notes"):
    notes = {}
    for filename in os.listdir(directory):
        if filename.endswith(".txt"):
            try:
                # Parse date from filename (format: YYYY-MM-DD.txt)
                date_str = filename.replace(".txt", "")
                date = datetime.strptime(date_str, "%Y-%m-%d")
                with open(os.path.join(directory, filename), "r", encoding="utf-8") as f:
                    notes[date] = f"Date: {date} \n {f.read().strip()}\n\n"  # Store as datetime object
            except ValueError:
                pass  # Skip invalid filenames
    return notes

def getPrompt(input):
    notes = load_notes()
    prompt = f"You are a helper in my project where I will need you to retreive information from my notes. I will attach them bellow.The questions that I have for you is {input}\n\nThe responses that you give are menat to be short and to the point so no need to make it fancy.\n\nThere are no restrictions\n\nNotes: {notes}"
    return prompt
