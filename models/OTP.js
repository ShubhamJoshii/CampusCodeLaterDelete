const mongoose = require("mongoose");

const OTPVerificationSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  OTP: { type: String, required: true },
  createdAt: { type: Date },
  expiresAt: { type: Date },
});

module.exports = mongoose.model("OTPs", OTPVerificationSchema);