const express = require("express");
const Problems = require("../../models/Problems");
const router = express.Router();

router.get("/searchProblems", async (req, res) => {
  // console.log("Hello world");
  try {
    let { search, pageNo, limit } = req.query;
    // console.log(search, limit, pageNo);
    pageNo = parseInt(pageNo);
    limit = parseInt(limit);

    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const [problems, totalCount, categories] = await Promise.all([
      Problems.find(filter)
        .select("title difficulty tags")
        .limit(limit)
        .skip((pageNo - 1) * limit),
      Problems.countDocuments(filter),
      Problems.distinct("tags"),
    ]);
    // console.log(problems);

    res.status(200).json({
      success: true,
      data: problems,
      categories: ["all", ...categories],
      pagination: {
        total: totalCount,
        page: pageNo,
        limit: limit,
        totalPages: Math.ceil(totalCount / limit),
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
