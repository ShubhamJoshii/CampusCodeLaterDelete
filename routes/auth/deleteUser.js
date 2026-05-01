const express = require("express");
const UserModel = require("../../models/User");
const router = express.Router();

router.delete("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).send({
        success: false,
        msg: "User not found",
      });
    }

    // Prevent deleting verified users (optional rule)
    if (user.isVerified) {
      return res.status(400).send({
        success: false,
        msg: "Verified users cannot be deleted",
      });
    }

    const result = await UserModel.deleteOne({ _id: id });

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