const mongoose = require("mongoose");
const ServisKayitSchema = new mongoose.Schema({
  servis: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  musteriAdi: String,
  adres: String,
  urun: String,
  ariza: String,
  tarih: Date,
});
module.exports = mongoose.model("ServisKayit", ServisKayitSchema);
