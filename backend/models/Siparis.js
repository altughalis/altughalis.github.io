const mongoose = require("mongoose");
const SiparisSchema = new mongoose.Schema({
  bayi: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  urun: String,
  adet: Number,
  durum: String,
  tarih: Date,
});
module.exports = mongoose.model("Siparis", SiparisSchema);
