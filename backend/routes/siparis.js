const express = require("express");
const router = express.Router();
const Siparis = require("../models/Siparis");

router.get("/", async (req, res) => {
  const siparisler = await Siparis.find();
  res.json(siparisler);
});

router.post("/", async (req, res) => {
  const siparis = new Siparis(req.body);
  await siparis.save();
  res.json(siparis);
});

module.exports = router;
