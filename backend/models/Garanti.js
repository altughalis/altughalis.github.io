const mongoose = require("mongoose");
const GarantiSchema = new mongoose.Schema({
  seriNo: String,
  durum: String,
  servis: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  islem: String,
  tarih: Date,
});
module.exports = mongoose.model("Garanti", GarantiSchema);
