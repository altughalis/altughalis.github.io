const express = require("express");
const router = express.Router();
const Satis = require("../models/Satis");

router.get("/", async (req, res) => {
  const satislar = await Satis.find();
  res.json(satislar);
});

router.post("/", async (req, res) => {
  const satis = new Satis(req.body);
  await satis.save();
  res.json(satis);
});

module.exports = router;
