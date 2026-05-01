const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const Group = require("../../models/Group");
const router = express.Router();

router.post("/joingroup", authMiddleware, async (req, res) => {
  const { invitationCode } = req.body;
  console.log(invitationCode);
  try {
    const groupUserExist = await Group.findOne({invitationCode});

    if (
      groupUserExist.admins.includes(req.userID) ||
      groupUserExist.members.includes(req.userID)
    ) {
      return res.status(409).json({
        success: false,
        msg: "User already in group",
      });
    }

    const group = await Group.updateOne(
      { invitationCode },
      {
        $addToSet: {
          members: req.userID,
        },
      },
    );

    console.log(group);
    res.status(200).json({
      success: true,
      invitationCode,
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
