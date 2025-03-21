require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Grade = require("../models/Grade");

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/diaryDB";

mongoose.connect(mongoURI)
  .then(() => console.log("Connected"))
  .catch(err => console.error("Error", err));

const seedDatabase = async () => {
  await User.deleteMany();
  await Grade.deleteMany();

  const hashedPassword = "$2b$10$DCzEHfYWtnqExOEpmaWUW.oOeGX7t3rKEo1D894ioCENHSwkm0fJm"; // 123456

  const teacher = await User.create({ name: "John Michael", email: "teacher1@mail.com", password: hashedPassword, role: "teacher" });
  const student1 = await User.create({ name: "Ariana Grande", email: "ariana@mail.com", password: hashedPassword, role: "student" });
  const student2 = await User.create({ name: "Michael Jackson", email: "michael@mail.com", password: hashedPassword, role: "student" });

  await Grade.create([
    { student: student1._id, subject: "History", score: 5 },
    { student: student1._id, subject: "Math", score: 4 },
    { student: student2._id, subject: "Chemistry", score: 3 },
    { student: student2._id, subject: "PE", score: 5 }
  ]);

  console.log("Success");
  mongoose.disconnect();
};

seedDatabase();
