require("dotenv").config();
const express = require('express');
const path = require("path");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const connectDB = require("./database.js");
// const seedData = require("./seedProblem.js");
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(`/api`, require("./auth")); 
app.use(`/api`, require("./routes/index"));

app.use(express.static(path.resolve(__dirname, "frontend", "docs")));

app.get("/", (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, "frontend", "docs", "index.html"));
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "docs", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});