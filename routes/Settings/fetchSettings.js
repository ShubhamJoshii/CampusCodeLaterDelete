const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");

const UserModel = require("../../models/User");
const router = express.Router();

router.get("/fetchsettings", authMiddleware, async (req, res) => {
  console.log("Heloo world");
  try {
    const user = await UserModel.findById(req.userID).lean();

    const sessions = (user.login || [])
      .map((item) => ({
        loginAt: item.loginAt,
        lastActiveAt: item.lastActiveAt,
        deviceInfo: item.deviceInfo,
        deviceLocation: item.deviceLocation,
        isCurr: item.token === req.token,
        isActive: item.isActive,
      }))
      .sort((a, b) => {
        if (a.isCurr !== b.isCurr) return b.isCurr - a.isCurr;
        return new Date(b.lastActiveAt) - new Date(a.lastActiveAt);
      }).filter(e => e.isActive);

    res.status(200).json({
      success: true,
      data: { userName:user.userName, email: user.email, setting: sessions },
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
