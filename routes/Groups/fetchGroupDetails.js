const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const Group = require("../../models/Group");
const router = express.Router();

router.get("/groupdetails/:_id", authMiddleware, async (req, res) => {
  const _id = req.params._id;

  try {
    const group = await Group.findById(_id).select(
      "name admins members problems",
    );

    const isAdmin = !!group.admins.find(
      (e) => e.toString() == req.userID.toString(),
    );
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const totalMembers = group.members.length + group.admins.length;

    const totalQuestions = group.problems.length;

    const groupObj = group.toObject();

    delete groupObj.problems;

    res.status(200).json({
      success: true,
      group: {
        ...groupObj,
        totalMembers,
        totalQuestions,
        yourRank: 1,
        isAdmin
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
