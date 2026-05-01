const express = require("express");
const Submission = require("../../models/Submission");
const router = express.Router();

router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboardData = await Submission.find({}, "pointEarned").populate(
      "user",
      "firstName lastName userName",
    );

    let leaderData = leaderboardData.reduce((acc, curr) => {
      const userID = curr.user._id;
      if (!acc[userID]) {
        acc[userID] = {
          userID,
          name: `${curr.user.userName || curr.user.firstName + " " + curr.user.lastName}`,
          totalPointEarned: curr.pointEarned,
        };
      } else {
        acc[userID].totalPointEarned += curr.pointEarned;
      }
      return acc;
    }, {});

    leaderData = Object.values(leaderData).sort(
      (a, b) => b.totalPointEarned - a.totalPointEarned,
    );

    // console.log(leaderData);
    res.status(200).json({
      success: true,
      data: leaderData,
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
