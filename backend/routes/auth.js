const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Kullanıcı login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Şifre hatalı" });
  const token = jwt.sign({ userId: user._id, role: user.role }, "SECRET_KEY", {
    expiresIn: "1d",
  });
  res.json({ token, user });
});

// Yeni kullanıcı kaydı
router.post("/register", async (req, res) => {
  const { username, name, email, password, role, parent } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, name, email, password: hash, role, parent });
  try {
    await user.save();
    res.json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
