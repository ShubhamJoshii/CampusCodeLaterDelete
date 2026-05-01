const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const Group = require("../../models/Group");
const mongoose = require("mongoose");
const Submission = require("../../models/Submission");

const router = express.Router();

router.get("/groupdetails/:_id/problems", authMiddleware, async (req, res) => {
  const _id = req.params._id;

  let { pageNo = 1, limit = 10, difficulty, tag } = req.query; 

  pageNo = Math.max(1, parseInt(pageNo) || 1);
  limit = Math.max(1, parseInt(limit) || 10);

  const skip = (pageNo - 1) * limit;

  try {
    const group = await Group.findById(_id)
      .select("problems")
      .populate("problems.problem", "title difficulty tags");

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const groupObj = group.toObject();

    let allProblems = groupObj.problems
      .filter((p) => p.problem)
      .map((p) => ({
        ...p.problem,
        addedAt: p.addedAt,
      }));

    const categoriesSet = new Set();
    allProblems.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((t) => categoriesSet.add(t));
      }
    });

    const categories = ["all", ...categoriesSet];

    let filteredProblems = [...allProblems];

    if (difficulty) {
      filteredProblems = filteredProblems.filter(
        (p) => p.difficulty?.toLowerCase() === difficulty.toLowerCase(),
      );
    }

    if (tag && tag.toLowerCase() !== "all") {
      const tagsArray = tag.split(",");
      filteredProblems = filteredProblems.filter((p) =>
        p.tags?.some((t) => tagsArray.includes(t)),
      );
    }

    const totalQuestions = filteredProblems.length;
    const paginatedProblems = filteredProblems.slice(skip, skip + limit);

    let data = paginatedProblems;
    let attemptedProblems = [];

    if (req.userID) {
      attemptedProblems = await Submission.find(
        { user: req.userID, groupId:_id },
        "problem status title",
      );
      // console.log(attemptedProblems);
      data = paginatedProblems.map((problem) => {
        const found = attemptedProblems.find(
          (e) => e.problem.toString() === problem._id.toString(),
        );
        // console.log(found);
        return {
          ...problem,
          attempt: found ? found.status : null,
        };
      });
    }

    // console.log(data);

    const pagination = {
      total: totalQuestions,
      page: pageNo,
      limit: limit,
      totalPages: Math.ceil(totalQuestions / limit),
    };

    res.status(200).json({
      success: true,
      data: {
        problems: data,
        categories,
        pagination,
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
