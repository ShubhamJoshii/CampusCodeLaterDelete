const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const Group = require("../../models/Group");

const router = express.Router();

router.get("/groupdetails/:_id/members", authMiddleware, async (req, res) => {
  const _id = req.params._id;

  let { pageNo = 1, limit = 10 } = req.query;

  pageNo = Math.max(1, parseInt(pageNo) || 1);
  limit = Math.max(1, parseInt(limit) || 10);

  const skip = (pageNo - 1) * limit;

  try {
    const group = await Group.findById(_id)
      .select("members admins") // ✅ include admins
      .populate("members", "firstName lastName email userName")
      .populate("admins", "firstName lastName email userName");

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // ✅ Convert to plain object
    const groupObj = group.toObject();

    // ✅ Merge admins + members
    const allUsers = [
      ...(groupObj.admins || []).map(user => ({ ...user, role: "admin" })),
      ...(groupObj.members || []).map(user => ({ ...user, role: "member" })),
    ];

    // ✅ Pagination on combined array
    const groupUsers = allUsers.slice(skip, skip + limit);

    const pagination = {
      total: allUsers.length,
      page: pageNo,
      limit: limit,
      totalPages: Math.ceil(allUsers.length / limit),
    };

    res.status(200).json({
      success: true,
      data: {
        members: groupUsers,
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