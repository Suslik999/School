const express = require("express");
const Grade = require("../models/Grade");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId || studentId === "undefined") {
      return res.status(400).json({ message: "Error student ID" });
    }

    const grades = await Grade.find({ student: studentId }).populate("student");

    if (!grades.length) {
      return res.status(404).json({ message: "Grade no found" });
    }

    res.json(grades);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.post("/", async (req, res) => {
  const { student, subject, score } = req.body;

  if (!student || !subject || !score) {
    return res.status(400).json({ message: "All fields important!" });
  }

  try {

    const newGrade = new Grade({ student, subject, score });
    await newGrade.save();

    res.status(201).json({ message: "Siccess", grade: newGrade });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
