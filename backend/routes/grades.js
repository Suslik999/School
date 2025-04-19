const express = require("express");
const Grade = require("../models/Grade");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "student") {
      query.student = req.user.id;
    }

    const grades = await Grade.find(query).populate("student");
    res.json(grades);
  } catch (error) {
    console.error("Grades error", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied" });
  }

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

router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const { subject, score } = req.body;

    const updatedGrade = await Grade.findByIdAndUpdate(
      req.params.id,
      { ...(subject && { subject }), ...(score !== undefined && { score }) },
      { new: true }
    );

    if (!updatedGrade) {
      return res.status(404).json({ message: "Grade not found" });
    }

    res.json(updatedGrade);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const deletedGrade = await Grade.findByIdAndDelete(req.params.id);

    if (!deletedGrade) {
      return res.status(404).json({ message: "Grade not found" });
    }

    res.json({ message: "Grade deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
