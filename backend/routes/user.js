const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Kullanıcıları listele
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Yeni kullanıcı ekle
router.post("/", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// Kullanıcı güncelle
router.put("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

// Kullanıcı sil
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Kullanıcı silindi" });
});

module.exports = router;
