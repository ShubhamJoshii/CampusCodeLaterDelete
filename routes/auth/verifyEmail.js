const express = require("express");
const UserModel = require("../../models/User");
const router = express.Router();

const env = process.env.NODE_ENV;

router.get("/verify-email", async (req, res) => {
  const redirectbaseURL =
    env === "PRODUCTION"
      ? `https://${req.headers.host}`
      : "http://localhost:3000";

  try {
    const token = req.query.token;
    const user = await UserModel.findOne({ emailToken: token });
    if (user.isVerified) {
      return res.redirect(`${redirectbaseURL}/signup?status=alreadyVerified`);
    }
    if (user) {
      user.isVerified = true;
      await user.save();
      res.redirect(`${redirectbaseURL}/signup?status=success`);
    }
  } catch (error) {
    res.redirect(`${redirectbaseURL}/signup?status=failure`);
  }
});

module.exports = router;