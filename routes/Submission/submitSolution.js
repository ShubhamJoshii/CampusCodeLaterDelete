const express = require("express");
const runCodeFunction = require("./runCodeFunction");
const authMiddleware = require("../../middleware/authMiddleware");

const Submission = require("../../models/Submission");

const router = express.Router();

router.post("/submitSolution", authMiddleware, async (req, res) => {
  // try {
  //   const { code, language, _id: problemId, groupId } = req.body;

  //   if (!code || !language || !problemId) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "code, language, and problemId are required",
  //     });
  //   }

  //   const result = await runCodeFunction(code, language, problemId);

  //   if (!result.success) {
  //     // console.log(result);
  //     return res.status(500).json(result);
  //   }

  //   const userId = req.userID || req.user?.id || req.user?._id;

  //   const summary = result.summary || {};
  //   const total = summary.total || 0;
  //   const passed = summary.passed || 0;
  //   let pointEarned = 0;

  //   let status = "";
  //   if (total === passed) {
  //     status = "Accepted";
  //     pointEarned = 100;
  //   } else if (total - passed !== 0) {
  //     status = "Runtime Error";
  //     pointEarned = passed * 25;
  //   } else {
  //     status = "Wrong Answer";
  //   }
  //   let submission;
  //   if (!groupId) {
  //     submission = await Submission.findOne({
  //       user: userId,
  //       problem: problemId,
  //     });
  //     if (submission) {
  //       submission.code = code;
  //       submission.language = language;
  //       submission.pointEarned = pointEarned;
  //       submission.status = status;
  //       submission.testCasesPassed = passed;
  //       submission.totalTestCases = total;
  //       submission.updatedAt = new Date();

  //       await submission.save();
  //     } else {
  //       submission = await Submission.create({
  //         user: userId,
  //         problem: problemId,
  //         code,
  //         pointEarned,
  //         language,
  //         status,
  //         testCasesPassed: passed,
  //         totalTestCases: total,
  //       });
  //     }
  //   } else {
  //     submission = await Submission.findOne({
  //       user: userId,
  //       problem: problemId,
  //       groupId,
  //     });
  //     if (submission) {
  //       submission.code = code;
  //       submission.language = language;
  //       submission.pointEarned = pointEarned;
  //       submission.status = status;
  //       submission.testCasesPassed = passed;
  //       submission.totalTestCases = total;
  //       submission.updatedAt = new Date();
  //       submission.groupId = groupId;

  //       await submission.save();
  //     } else {
  //       submission = await Submission.create({
  //         user: userId,
  //         problem: problemId,
  //         code,
  //         pointEarned,
  //         language,
  //         status,
  //         groupId,
  //         testCasesPassed: passed,
  //         totalTestCases: total,
  //       });
  //     }
  //   }

  //   if (total - passed !== 0) {
  //     return res.status(500).json(result);
  //   }
  //   // console.log(result);
  //   let data = result.results.map((e) => {
  //     return { ...e, verdict: "ACCEPTED & SUBMITTED" };
  //   });

  //   return res
  //     .status(200)
  //     .json({ ...result, results: data, isSubmitted: true });
  // } catch (error) {
  //   console.log(error);
  //   return res.status(500).json({
  //     success: false,
  //     message: error.message || "Internal Server Error",
  //   });
  // }
});

module.exports = router;
