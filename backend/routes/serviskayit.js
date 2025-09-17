const express = require("express");
const router = express.Router();
const ServisKayit = require("../models/ServisKayit");

router.get("/", async (req, res) => {
  const kayitlar = await ServisKayit.find();
  res.json(kayitlar);
});

router.post("/", async (req, res) => {
  const kayit = new ServisKayit(req.body);
  await kayit.save();
  res.json(kayit);
});

module.exports = router;
