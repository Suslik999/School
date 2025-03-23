const express = require("express");
const Grade = require("../models/Grade");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const grades = await Grade.find().populate("student");
    res.json(grades);
  } catch (error) {
    console.error("Grades error", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { student, subject, score } = req.body;

    if (!student || !subject || !score) {
      return res.status(400).json({ message: "Fill all fields" });
    }

    const grade = new Grade({ student, subject, score });
    await grade.save();

    res.status(201).json(grade);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
