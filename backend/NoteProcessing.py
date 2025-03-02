import os
from openai import OpenAI

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("API Key is missing. Set OPENAI_API_KEY in your environment variables.")

client = OpenAI(api_key=api_key)

def load_notes(directory):
    notes = {}
    for filename in os.listdir(directory):
        if filename.endswith(".txt"):
            date = filename.replace(".txt", "")
            with open(os.path.join(directory, filename), "r", encoding="utf-8") as file:
                notes[date] = file.read()
    return notes

notes = load_notes("backend/notes")

def ask_gpt(query):
    context = "\n\n".join(notes) if notes else "No relevant notes found."
    prompt = f"Here are my notes:\n\n{context}\n\nNow answer this question based on them: {query}"

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an assistant helping retrieve notes."},
            {"role": "user", "content": prompt}
        ]
    )

    return response["choices"][0]["message"]["content"]

while True:
    query = input("Ask a question (or 'exit' to quit): ")
    if query.lower() == "exit":
        break
    response = ask_gpt(query)
    print("\nGPT's Answer:\n", response)
