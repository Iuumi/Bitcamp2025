from flask import Flask, request, jsonify, send_from_directory
import os
import google.generativeai as genai
from dotenv import load_dotenv
import pandas as pd

app = Flask(__name__, static_folder="server", static_url_path="", template_folder="server")
load_dotenv()

genai.configure(api_key="Gemini_API_key")

# Load datasets
people_df = pd.read_csv("data/person_data.csv")
food_df = pd.read_csv("data/(NEW)food_data.csv")

generation_config = {
    "temperature": 0,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain"
}

safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
]

model = genai.GenerativeModel(
    model_name='gemini-2.0-flash',
    safety_settings=safety_settings,
    generation_config=generation_config,
    system_instruction="You are a personal chef, your job is to provide the user with meals and information regarding meals based off of the information the user provides you regarding their desired diet, height, weight, gender, lifestyle, and goals. Provide 3 suggestions for breakfast, lunch, & dinner unless they specify more or less. Initially create a very short summary that uses 200 tokens or less, this can be adjusted based on user demand and should increase by about 50 every message."
)

history = []
@app.route('/')
def index():
    return send_from_directory('server', 'main.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    chat_session = model.start_chat(history=history)
    response = chat_session.send_message(user_input)
    model_response = response.text

    # Update history
    history.append({"role": "user", "parts": [user_input]})
    history.append({"role": "model", "parts": [model_response]})

    return jsonify({"response": model_response})

if __name__ == '__main__':
    app.run(debug=True)
