import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

generation_config = {
    "temperature": 0,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain"
}

safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
]
model = genai.GenerativeModel(
    model_name='gemini-2.0-flash',
    safety_settings=safety_settings,
    generation_config=generation_config,
    system_instruction= "You are a personal chef, your job is to provide the user with meals and information regarding meals based off of the information the user provides you regarding their desired diet, height, weight, and gender. Provide multiple suggestions for breakfast, lunch, & dinner."
)

history = []

@app.route("/chat", methods = ["POST"])
def chat():
    data = request.get_json
    message = data.get("message")
    history = data.get("history", [])

    if not message:
        return jsonify({"error": "No message provided"}), 400
    
    chat_session = model.start_chat(history=history)
    response = chat_session.send_message(message)
    reply = response.text

    history.append({"role": "user", "parts": [message]})
    history.append({"role": "model", "parts": [reply]})
    return jsonify({"reply": reply, "history": history})

if __name__ == "__main__":
    app.run(port=8080)
