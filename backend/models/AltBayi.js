const mongoose = require("mongoose");

const AltBayiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("AltBayi", AltBayiSchema);
