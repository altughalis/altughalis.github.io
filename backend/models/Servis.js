const mongoose = require("mongoose");

const ServisSchema = new mongoose.Schema({
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  status: { type: String, required: true },
  altBayiId: { type: mongoose.Schema.Types.ObjectId, ref: "AltBayi" },
  tarih: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Servis", ServisSchema);
