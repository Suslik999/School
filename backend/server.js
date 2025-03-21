const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "JSON error" });
  }
  next();
});

const User = require("./models/User");
const Grade = require("./models/Grade");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const gradeRoutes = require("./routes/grades");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/grades", gradeRoutes);

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/diaryDB";
mongoose
  .connect(mongoURI)
  .then(() => console.log("Success db"))
  .catch((err) => console.error("Error mongodb", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server working ${PORT}`));
