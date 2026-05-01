const express = require("express");
const UserModel = require("../../models/User");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

router.delete("/user", authMiddleware, async (req, res) => {
  try {
    const result = await UserModel.deleteOne({ _id: req.userID });

    if (result.deletedCount === 0) {
      return res.status(400).send({
        success: false,
        msg: "Failed to delete user",
      });
    }

    res.send({
      success: true,
      msg: "User deleted successfully",
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      msg: error.message,
    });
  }
});


module.exports = router;