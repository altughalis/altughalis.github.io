const mongoose = require("mongoose");

const ServisSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Servis", ServisSchema);
