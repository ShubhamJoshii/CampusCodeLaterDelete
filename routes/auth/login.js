const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../../models/User");
const { ValidationError } = require("../../util/error");
const validator = require("../../middleware/validator.js");
const loginValidator = require("../../validators/loginValidator.js");
const UAParser = require("ua-parser-js");

const router = express.Router();

router.post("/login", validator(loginValidator), async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) throw new ValidationError("email", "Invalid email!");

    if (!user.isVerified)
      throw new ValidationError(
        "email",
        "Email not verified. Check your inbox or re-register"
      );

    const isPasswordValid = await bcrypt.compare(password, user.password);
    const isProduction = process.env.NODE_ENV === "production";

    if (!isPasswordValid) {
      throw new ValidationError("password", "Incorrect Password");
    }

    // ✅ Generate token FIRST
    const token = user.generateAuthToken();

    // ✅ Parse device info
    const parser = new UAParser(req.headers["user-agent"]);
    const device = parser.getDevice();
    const os = parser.getOS();
    const browser = parser.getBrowser();

    // ✅ Create login entry WITH token
    const loginEntry = {
      token,

      loginAt: new Date(),
      lastActiveAt: new Date(),

      deviceInfo: {
        browser: browser.name || "Unknown",
        os: os.name || "Unknown",
        device: device.type || "desktop",
        userAgent: req.headers["user-agent"],
      },

      deviceLocation: {
        ip:
          req.headers["x-forwarded-for"]?.split(",")[0] ||
          req.socket.remoteAddress,
      },
    };

    // ✅ Push login session
    user.login.push(loginEntry);

    // ✅ Set cookie
    res.cookie("LeetCodeToken", token, {
      expires: rememberMe
        ? new Date(Date.now() + 31 * 24 * 60 * 60 * 1000)
        : undefined,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    await user.save();

    return res.status(200).send({
      msg: "Welcome back! You're logged in.",
      user: {
        ...user._doc,
        password: null,
      },
      success: true,
    });

  } catch (error) {
    return res.status(400).send({
      msg: { message: error.message, target: error.target },
      success: false,
    });
  }
});

module.exports = router;