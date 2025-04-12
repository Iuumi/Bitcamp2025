require('dotenv').config();
const express = require("express");
const axios = require('axios');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("google.generativeai")
const corsOptions = {
    origin: ["http://localhost:5173"]
}
app.use(cors(corsOptions));
app.use(bodyParser.json())

app.get('/getGeminiData', async (req, res) => {
    try {
      const response = await axios.get('https://api.gemini.com/v1/some_endpoint', {
        headers: {
          'X-GEMINI-APIKEY': process.env.GEMINI_API_KEY
        }
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).send('Error fetching data from Gemini');
    }
  });
  
  app.listen(8080, () => console.log(`Server running on port 8080`));

app.post("/chat", async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "No message provided" });
      }
      
    try {
    const result = await model.generateContent(message);
    const reply = result.response.text();
    res.json({ reply });
    } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Something went wrong generating a response." });
    }
})

app.listen(8080, () => {
    console.log("Server started on port 8080");
});