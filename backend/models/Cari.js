const mongoose = require("mongoose");
const CariSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  gelir: Number,
  gider: Number,
  bakiye: Number,
  tarih: Date,
});
module.exports = mongoose.model("Cari", CariSchema);
