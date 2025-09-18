const mongoose = require("mongoose");

const AltBayiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: String, required: true },
  authorizedPerson: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  bayiCode: { type: String, required: true, unique: true },
  membershipStartDate: { type: Date, default: Date.now },
  balance: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AltBayi", AltBayiSchema);
