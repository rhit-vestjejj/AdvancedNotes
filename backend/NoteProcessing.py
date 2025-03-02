import os
from llama_cpp import Llama

model = Llama(model_path="Mistral-7B-Instruct-v0.1.Q4_K_M.gguf", n_ctx=4096, n_gpu_layers=0)  # Set n_gpu_layers to 0 if using CPU only

def load_notes(directory):
    notes = {}
    for filename in os.listdir(directory):
        if filename.endswith(".txt"):
            date = filename.replace(".txt", "")
            with open(os.path.join(directory, filename), "r", encoding="utf-8") as file:
                notes[date] = file.read()
    return notes

notes = load_notes("backend/notes")

def ask_llm(query):
    prompt = f"You are an assistant helping retrieve notes\n\nHere are my notes:\n\n{context}\n\nNow answer this question based on them: {query}"
    response = model(
        f"### Instruction:\n{prompt}\n### Response:", 
        max_tokens=256,
        stop=["### Instruction:", "### Response:"],  # Prevents excessive output
        echo=False
    )
    return response["choices"][0]["text"].strip()

while True:
    query = input("Ask a question (or 'exit' to quit): ")
    if query.lower() == "exit":
        break
    response = ask_llm(query)
    print("\nGPT's Answer:\n", response)
