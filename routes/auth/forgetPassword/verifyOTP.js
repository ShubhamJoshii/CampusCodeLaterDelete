const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../../../models/User");
const OTPModel = require("../../../models/OTP");
const { ValidationError } = require("../../../util/error");
const router = express.Router();

router.post("/verifyOTP", async (req, res) => {
  const { otpID, email, OTP } = req.body;
  try {
    const userExist = await UserModel.findOne({ email });
    const userOTPFind = await OTPModel.findOne({ _id: otpID });
    const expiresAt = userOTPFind.expiresAt;
    const hashedOTP = userOTPFind.OTP;
    if (expiresAt < Date.now()) {
      await OTPModel.deleteMany({ userID: userExist._id });
      throw new ValidationError("All", "OTP is expired. Please request Again");
    } else {
      let validOTP = await bcrypt.compare(OTP, hashedOTP);
      if (validOTP) {
        return res.send({
          success: true,
          user: { email: userExist.email, _id: userExist._id },
          msg: "Valid OTP. Enter New Password",
        });
      } else {
        throw new ValidationError("All", "Invalid OTP. Please Try Again");
      }
    }
  } catch (error) {
    return res.status(400).send({
      msg: { message: error.message, target: error.target },
      success: false,
    });
  }
});

module.exports = router;
