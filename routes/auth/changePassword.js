const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../../models/User");
const { ValidationError } = require("../../util/error");
const router = express.Router();
const validator = require("../../middleware/validator.js");
const authMiddleware = require("../../middleware/authMiddleware.js");

const { z } = require("zod");

const passwordValidator = z
  .object({
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/[0-9]/, "Must include a number")
      .regex(/[^A-Za-z0-9]/, "Must include a special character"),

    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


router.post("/changePassword",validator(passwordValidator),authMiddleware, async (req, res) => {
  const { password, confirmPassword } = req.body;
  try {
    const userExist = await UserModel.findOne({_id:req.userID});
    if (password != confirmPassword)
      throw new ValidationError("all", "Invalid Password");
    await userExist.updateOne({ password: await bcrypt.hash(password, 12) });
    
    await userExist.save();
    res.send({ success: true, msg: "Password Updated" });
  } catch (error) {
    return res.status(400).send({
      msg: error.message, 
      target: error.target,
      success: false,
    });
  }
});

module.exports = router;