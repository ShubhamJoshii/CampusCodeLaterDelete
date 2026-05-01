const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

router.get("/logout", authMiddleware, (req, res) => {
  res.clearCookie("LeetCodeToken", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).send({ msg: "User Logout", success: true });
});

module.exports = router;