from backend.note_processing import getPrompt
from ollama import chat

# Load the chatbot model (you can choose a different model if preferred)


def talk_ai(user_input):

    prompt = getPrompt(user_input)

    responses = chat(model = "deepseek-r1:8b", messages = [
        {
            'role':'user',
            'content': prompt,
        }
    ])       

    response_text = responses.message.content
    response_text = response_text.split("</think>")[1][2:]
                            
    return response_text