const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const Group = require("../../models/Group");
const router = express.Router();

router.post("/creategroup", authMiddleware, async (req, res) => {
  const { name } = req.body;
  try {
    const group = new Group({
      name,
      admins: [req.userID],
    });

    const response = await group.save();
    // console.log(response);
    res.status(200).json({
      success: true,
      invitationCode:response.invitationCode
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
