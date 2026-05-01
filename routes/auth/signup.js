const express = require("express");
const router = express.Router();
const UserModel = require("../../models/User.js");
const { ValidationError } = require("../../util/error.js");
const verifyEmailMail = require("../../util/verifyEmailMail.js");
const { transporter } = require("../../util/transporter.js");

const crypto = require("crypto");

const env = process.env.NODE_ENV;
const validator = require("../../middleware/validator.js");
const registerValidator = require("../../validators/registerValidator.js");

const randomSuffix = ["dev", "code", "pro", "x", "hub"];
function generateUsername(firstName, lastName) {
  return `${firstName}${lastName}`
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
}
function getRandomSuffix() {
  return randomSuffix[Math.floor(Math.random() * randomSuffix.length)];
}

router.post("/signup", validator(registerValidator), async (req, res) => {
  // router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  let base = generateUsername(firstName, lastName);
  let userName = `${base}_${getRandomSuffix()}`;

  const BASE_URL =
    env === "PRODUCTION"
      ? `https://${req.headers.host}/api`
      : "http://localhost:5000/api";

  let emailToken = crypto.randomBytes(32).toString("hex");

  var VerfiedLink = `${BASE_URL}/verify-email?token=${emailToken}`;

  try {
    if (!firstName || !lastName || !email || !password)
      throw new ValidationError("All", "All Field are required");
    if (password != confirmPassword)
      throw new ValidationError("password", "Password doen't Matched");
    
    const userAlreadyExist = await UserModel.findOne({ email });
    let exists = await UserModel.findOne({ userName });
    let counter = 1;
    while (exists) {
      userName = `${base}_${getRandomSuffix()}${Math.floor(Math.random() * 1000)}${counter}`;
      exists = await User.findOne({ userName });
      counter++;
    }
    console.log(userName);

    if (!userAlreadyExist) {
      const newUser = new UserModel({
        firstName,
        lastName,
        userName,
        email,
        emailToken,
        password,
      });
      let message = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Let's complete your account setup",
        html: verifyEmailMail(firstName + " " + lastName, VerfiedLink),
      };
      let temp = await newUser.save();

      try {
        await transporter.sendMail(message);

        return res.send({
          msg: "User registered successfully. Verification email sent.",
          user: { email: req.body.email, _id: temp._doc._id },
          success: true,
        });
      } catch (error) {
        return res.send({
          msg: "User registered, but email could not be sent.",
          user: { email: req.body.email, _id: temp._doc._id },
          success: false,
        });
      }
    }
    throw new ValidationError("email", "Email already exists!");
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      msg: { message: error.message, target: error.target },
      success: false,
    });
  }
});

module.exports = router;
