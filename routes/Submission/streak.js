const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const Submission = require("../../models/Submission");

const calculateStreak = require("./calculateStreak ");
const router = express.Router();

router.get("/streak", authMiddleware, async (req, res) => {
  try {
    const fetchedData = await Submission.find({ user: req.userID });

    const streak = calculateStreak(fetchedData);

    res.status(200).json({
      success: true,
      streak,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;
