const express = require("express");
const Grade = require("../models/Grade");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = {};

    if (req.query.student) {
      query.student = req.query.student;
    }

    const grades = await Grade.find(query).populate("student");
    res.json(grades);
  } catch (error) {
    console.error("Grades error", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { student, subject, score } = req.body;

    if (!student || !subject || score == null) {
      return res.status(400).json({ message: "Fill all fields" });
    }

    if (score < 1 || score > 5) {
      return res.status(400).json({ message: "Grade must be between 1 and 5" });
    }

    const grade = new Grade({ student, subject, score });
    await grade.save();

    res.status(201).json(grade);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { student, subject, score } = req.body;

    if (!student || !subject || score == null) {
      return res.status(400).json({ message: "Fill all fields" });
    }

    if (score < 1 || score > 5) {
      return res.status(400).json({ message: "Grade must be between 1 and 5" });
    }

    const updatedGrade = await Grade.findByIdAndUpdate(
      req.params.id,
      { student, subject, score },
      { new: true }
    );

    if (!updatedGrade) {
      return res.status(404).json({ message: "Grade not found" });
    }

    res.json(updatedGrade);
  } catch (error) {
    console.error("Update error", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedGrade = await Grade.findByIdAndDelete(req.params.id);

    if (!deletedGrade) {
      return res.status(404).json({ message: "Grade not found" });
    }

    res.json({ message: "Grade deleted" });
  } catch (error) {
    console.error("Delete error", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
