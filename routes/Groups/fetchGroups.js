const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const Group = require("../../models/Group");
const router = express.Router();

router.get("/groups", authMiddleware, async (req, res) => {
  try {
    const joinedGroups = await Group.find(
      {
        $or: [{ members: req.userID }, { admins: req.userID }],
      },
      "name admins invitationCode",
    );

    const result = joinedGroups.map((curr) => ({
      ...curr._doc,
      isAdmin: curr.admins.some((a) => a.toString() === req.userID.toString()),
    }));

    // console.log(req.userID);
    res.status(200).json({
      success: true,
      data: result,
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
