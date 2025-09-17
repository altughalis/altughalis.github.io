const mongoose = require("mongoose");
const SatisSchema = new mongoose.Schema({
  bayi: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  urun: String,
  adet: Number,
  fiyat: Number,
  tarih: Date,
});
module.exports = mongoose.model("Satis", SatisSchema);
