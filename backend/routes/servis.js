const express = require("express");
const router = express.Router();
const Servis = require("../models/Servis");

// Servis ekle
router.post("/", async (req, res) => {
  try {
    const servis = new Servis(req.body);
    await servis.save();
    res.status(201).json(servis);
  } catch (err) {
    res.status(400).json({ error: "Servis eklenemedi" });
  }
});

// Servisleri listele (region ile filtrelenebilir)
router.get("/", async (req, res) => {
  const { region } = req.query;
  const servisler = await Servis.find(region ? { region } : {});
  res.json(servisler);
});

// Servis sil
router.delete("/:id", async (req, res) => {
  try {
    await Servis.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Servis silinemedi" });
  }
});

// Servis düzenle
router.put("/:id", async (req, res) => {
  try {
    const servis = await Servis.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(servis);
  } catch (err) {
    res.status(400).json({ error: "Servis güncellenemedi" });
  }
});

module.exports = router;
