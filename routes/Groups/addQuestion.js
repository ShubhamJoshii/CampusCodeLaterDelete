const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const Group = require("../../models/Group");
const mongoose = require("mongoose");
const Problems = require("../../models/Problems");

const router = express.Router();

router.post("/groupdetails/addProblem", authMiddleware, async (req, res) => {
  const { _id, problemId, date } = req.body;

  try {
    // 1. Try to update the schedule if the problemId ALREADY exists in the array
    const updateResult = await Group.updateOne(
      { _id, "problems.problem": problemId }, 
      { $set: { "problems.$.schedule": date } }
    );

    // 2. If no document was modified, it means the problemId doesn't exist yet
    if (updateResult.modifiedCount === 0) {
      await Group.updateOne(
        { _id },
        {
          $push: {
            problems: {
              problem: problemId,
              schedule: date,
            },
          },
        }
      );
    }

    res.status(200).json({
      success: true,
      message: updateResult.modifiedCount > 0 ? "Problem updated" : "Problem added",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
