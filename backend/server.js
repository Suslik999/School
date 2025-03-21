require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI || "mongodb://192.168.1.72:27017/diaryDB";
mongoose.connect(mongoURI)
  .then(() => console.log("Server connected"))
  .catch(err => console.error("Error", err));

app.listen(5000, () => console.log("Server working"));
