const express = require("express");
const router = express.Router();
const Garanti = require("../models/Garanti");

router.get("/", async (req, res) => {
  const garantiler = await Garanti.find();
  res.json(garantiler);
});

router.post("/", async (req, res) => {
  const garanti = new Garanti(req.body);
  await garanti.save();
  res.json(garanti);
});

module.exports = router;
