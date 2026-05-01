const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const Group = require("../../models/Group");
const mongoose = require("mongoose");
const Problems = require("../../models/Problems");

const router = express.Router();

const checkDateStatus = (storedDateString) => {
  const targetDate = new Date(storedDateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  if (targetDate.getTime() <= today.getTime()) {
    return true;
  } else {
    return false;
  }
};

router.get(
  "/groupdetails/:_id/allproblems",
  authMiddleware,
  async (req, res) => {
    const _id = req.params._id;
    try {
      const group = await Group.findById(_id)
        .select("problems")
        .populate("problems.problem", "_id");

      if (!group) {
        return res.status(404).json({
          success: false,
          message: "Group not found",
        });
      }

      const problemAlreadyAdded = group.problems
        .filter((prob) => {
          return checkDateStatus(prob.schedule);
        })
        .map((prob) => prob.problem._id);
      const problemAlreadyScheduled = group.problems
        .filter((prob) => {
          return !checkDateStatus(prob.schedule);
        })
        .map((prob) => ({ _id: prob.problem._id, schedule: prob.schedule }));

      const problemsTemp = await Problems.find(
        {
          _id: { $nin: problemAlreadyAdded },
        },
        "sno title description tags difficulty",
      ).lean();

      const problems = problemsTemp.map((curr) => {
        let isScheduled = problemAlreadyScheduled.find(
          (e) => e._id == curr._id.toString(),
        );
        return {
          ...curr,
          isSchduled: isScheduled ? isScheduled.schedule : null,
        };
      });

      res.status(200).json({
        success: true,
        data: {
          problems,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

module.exports = router;
