const express = require("express");
const app = express();

app.get("/api", (req, res) => {
    res.json({"fruits": ["apple", "Orange"]})
})