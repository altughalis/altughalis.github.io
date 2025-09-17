const express = require("express");
const router = express.Router();
const Cari = require("../models/Cari");

router.get("/", async (req, res) => {
  const cariler = await Cari.find();
  res.json(cariler);
});

router.post("/", async (req, res) => {
  const cari = new Cari(req.body);
  await cari.save();
  res.json(cari);
});

module.exports = router;
