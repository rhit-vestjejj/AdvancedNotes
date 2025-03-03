from note_processing import getPrompt
from ollama import chat

# Load the chatbot model (you can choose a different model if preferred)


while True:
    user_input = input("You: ")
    if user_input.lower() in ["quit", "exit"]:
        break
    
    prompt = getPrompt(user_input)

    responses = chat(model = "deepseek-r1:8b", messages = [
        {
            'role':'user',
            'content': prompt,
        }
    ])       

    response_text = responses.message.content
    response_text = response_text.split("</think>")[1][2:]
                            
    print("AI:", response_text)
