const express = require("express");
const router = express.Router();
const AltBayi = require("../models/AltBayi");

// Alt bayi ekle
router.post("/", async (req, res) => {
  try {
    const altBayi = new AltBayi(req.body);
    await altBayi.save();
    res.status(201).json(altBayi);
  } catch (err) {
    res.status(400).json({ error: "Alt bayi eklenemedi" });
  }
});

// Alt bayileri listele (region ile filtrelenebilir)
router.get("/", async (req, res) => {
  const { region } = req.query;
  const altBayiler = await AltBayi.find(region ? { region } : {});
  res.json(altBayiler);
});

module.exports = router;
