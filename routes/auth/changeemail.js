const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const bcrypt = require("bcrypt");
const UserModel = require("../../models/User");
const { ValidationError } = require("../../util/error");
const router = express.Router();

router.post("/changeemail", authMiddleware, async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await UserModel.findById(req.userID);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ValidationError("password", "Incorrect Password");
    }

    user.email = email;
    await user.save();

    res.status(200).json({
      success: true,
       msg : "Email Updated!" ,
    });
  } catch (error) {
    console.log(error.message, error.target);
    res.status(500).json({
      success: false,
      target: error.target,
      msg: error.message,
    });
  }
});

module.exports = router;
