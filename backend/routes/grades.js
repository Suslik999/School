const express = require("express");
const Grade = require("../models/Grade");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const grades = req.user.role === "teacher"
    ? await Grade.find().populate("student")
    : await Grade.find({ student: req.user.id });

  res.json(grades);
});

router.post("/", auth, async (req, res) => {
  if (req.user.role !== "teacher") return res.status(403).json({ error: "No access" });

  const grade = new Grade(req.body);
  await grade.save();
  res.status(201).json(grade);
});

module.exports = router;
