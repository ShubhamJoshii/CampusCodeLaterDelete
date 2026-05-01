const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const Submission = require("../../models/Submission");
const Problems = require("../../models/Problems");
const calculateStreak = require("../Submission/calculateStreak ");
const router = express.Router();

router.get("/submission", authMiddleware, async (req, res) => {
  try {
    const fetchedData = await Submission.find({ user: req.userID ,groupId:null }).populate(
      "problem",
      "difficulty tags",
    );

    const categoryMap = {};
    const colors = [
      "#22c55e",
      "#eab308",
      "#ef4444",
      "#6366f1",
      "#a855f7",
      "#14b8a6",
      "#f97316",
    ];

    fetchedData.forEach((sub) => {
      const category = sub.problem?.tags?.[0] || "Other";
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const categoryBreakdown = Object.keys(categoryMap).map((key, index) => ({
      name: key,
      value: categoryMap[key],
      color: colors[index % colors.length],
    }));

    const totalProblems = await Problems.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
    ]);

    const difficultyMap = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    const totalMap = {
      easy: 0,
      medium: 0,
      hard: 0,
    };
    totalProblems.forEach((item) => {
      totalMap[item._id.toLowerCase()] = item.count;
    });

    fetchedData.forEach((sub) => {
      const diff = sub.problem?.difficulty?.toLowerCase();
      if (diff && difficultyMap.hasOwnProperty(diff)) {
        difficultyMap[diff]++;
      }
    });

    const difficultyStats = [
      {
        label: "Easy",
        solved: difficultyMap.easy,
        total: totalMap.easy,
        color: "#22c55e",
      },
      {
        label: "Medium",
        solved: difficultyMap.medium,
        total: totalMap.medium,
        color: "#eab308",
      },
      {
        label: "Hard",
        solved: difficultyMap.hard,
        total: totalMap.hard,
        color: "#ef4444",
      },
    ];

    const totalSolved = difficultyStats.reduce(
      (sum, curr) => sum + curr.solved,
      0,
    );
    const totalQuestion = difficultyStats.reduce(
      (sum, curr) => sum + curr.total,
      0,
    );

    const streak = calculateStreak(fetchedData);

    let heatmapData = Object.values(
      fetchedData.reduce((acc, curr) => {
        const date = new Date(curr.createdAt).toISOString().split("T")[0];

        if (!acc[date]) {
          acc[date] = { date, count: 0 };
        }

        acc[date].count += 1;

        return acc;
      }, {}),
    );
    heatmapData = heatmapData.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({
      success: true,
      data: fetchedData,
      categoryBreakdown,
      totalSolved,
      difficultyStats,
      streak,
      totalQuestion,
      heatmapData,
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
