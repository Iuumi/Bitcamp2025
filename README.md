# Bitcamp2025

## Mealbot
<img src="logo.png" alt="mealbot" style="width:150px; display: block; margin: 0 auto; float: left" />

Oftentimes college students who live in apartments aren't aware what foods they can make or have access to and as such have poor diets, we sought to help remedy this issue in an easily accessible manner. This is where Mealbot comes in! It is a chatbot that answers all questions about meal prepping. 

<br></br>

<img src="mealbot_output.png" alt="mealbot output" style="width:1200px;"/>

## Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Flask (Python)
* AI Model: Gemini API

## Setup Instructions (Local Development)

To run MealPrep on your local machine, follow these steps:

**Prerequisites:**

* Python 3.9 or above installed
* Access to the Gemini API
* Git (optional, for cloning the repository)

**1.  Clone the Repository (Optional):**

    If you have Git installed, you can clone the project repository:

    ```bash
    git clone <repository_url> 
    cd mealbot_bitcamp2025  # Navigate to the project directory
    ```


**2.  Install Dependencies:**

    Install the required Python packages 


**4.  Obtain a Gemini API Key:**

    * Go to the Google Cloud Console: [https://console.cloud.google.com/](https://console.cloud.google.com/)
    * Create a new project or select an existing one.
    * Enable the Gemini API for your project.
    * Create API credentials.  You'll need an API key to access the Gemini API.
    * **Important:** Keep your API key secure.  Do not share it publicly.

**5. Replace the key in the .py file:**

    Replace the 'GEMINI_key' with your API key in line 10 of the assitant.py file.

**6. Run the application:**

    Run the following command in the terminal

    ```bash
    python assistant.py
    ```