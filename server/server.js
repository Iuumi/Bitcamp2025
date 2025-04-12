const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("google.generativeai")
const corsOptions = {
    origin: ["http://localhost:5173"]
}
app.use(cors(corsOptions));
app.use(bodyParser.json())

app.get("/api", (req, res) => {
    res.json({fruits: ["apple", "Orange", "Banana"]})
})

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