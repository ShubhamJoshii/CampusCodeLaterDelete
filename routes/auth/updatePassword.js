const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../../models/User");
const { ValidationError } = require("../../util/error");
const router = express.Router();
const validator = require("../../middleware/validator.js");
const passwordValidator = require("../../validators/passwordValidator.js");

router.post("/updatePassword",validator(passwordValidator), async (req, res) => {
  const { password, confirmPassword, email } = req.body;
  try {
    const userExist = await UserModel.findOne({ email });
    if (!userExist) throw new ValidationError("email", "Invalid credentials");
    if (password != confirmPassword)
      throw new ValidationError("all", "Invalid Password");
    await userExist.updateOne({ password: await bcrypt.hash(password, 12) });
    console.log(password, confirmPassword, email);
    
    await userExist.save();
    res.send({ success: true, message: "Password Updated" });
  } catch (error) {
    return res.status(400).send({
      msg: { message: error.message, target: error.target },
      success: false,
    });
  }
});

module.exports = router;