const express = require("express");
const Problems = require("../../models/Problems");
const Submission = require("../../models/Submission");
const router = express.Router();

const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

router.get("/problems", async (req, res) => {
  try {
    let { pageNo = 1, limit = 10, difficulty, tag } = req.query;

    pageNo = parseInt(pageNo);
    limit = parseInt(limit);

    const filter = {};
    if (difficulty) {
      filter.difficulty = difficulty.toLowerCase();
    }

    if (tag && tag.toLowerCase() !== "all") {
      const tagsArray = tag.split(",");
      filter.tags = { $in: tagsArray };
    }

    const [problems, categories, totalCount] = await Promise.all([
      Problems.find(filter)
        .select("sno title difficulty tags")
        .limit(limit)
        .skip((pageNo - 1) * limit),
      Problems.distinct("tags"),
      Problems.countDocuments(filter),
    ]);

    let userId = null;

    try {
      const token = req.cookies?.LeetCodeToken;
      if (token) {
        const decoded = jwt.verify(token, SECRET_KEY);
        userId = decoded._id;
      }
    } catch (err) {
      userId = null;
    }

    let data = problems;
    let attemptedProblems = [];

    if (userId) {
      attemptedProblems = await Submission.find(
        { user: userId },
        "problem status title",
      );
      data = problems.map((problem) => {
        const found = attemptedProblems.find(
          (e) => e.problem.toString() === problem._id.toString(),
        );
        return {
          ...problem.toObject(),
          attempt: found ? found.status : null,
        };
      });
    }

    res.status(200).json({
      success: true,
      data,
      attemptedProblemsCount: attemptedProblems.length,
      categories: ["all", ...categories],
      pagination: {
        total: totalCount,
        page: pageNo,
        limit: limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;
