const express = require("express");
const router = express.Router();

router.use("/",require("./auth/home"));
router.use("/",require("./auth/signup"));
router.use("/",require("./auth/login"));
router.use("/",require("./auth/logout"));
router.use("/",require("./auth/updatePassword"));
router.use("/",require("./auth/verifyEmail"));
router.use("/",require("./auth/deleteUser"));
router.use("/",require("./auth/forgetPassword/sendOTP"));
router.use("/",require("./auth/forgetPassword/verifyOTP"));
router.use("/",require("./auth/changeusername"));
router.use("/",require("./auth/changeemail"));
router.use("/",require("./auth/changePassword"));
router.use("/",require("./auth/deleteUser(Verified)"));

router.use("/",require("./Problems/addproblem"));
router.use("/",require("./Problems/problemDetails"));
router.use("/",require("./Problems/fetchAllProblems"));
router.use("/",require("./Problems/searchProblems"));

router.use("/",require("./Progress/fetchAllSubmissions"));

router.use("/",require("./Submission/submitSolution"));
router.use("/",require("./Submission/streak"));
// router.use("/",require("./Submission/runCode(judge0)"));
router.use("/",require("./Submission/runCode(Terminal)"));

router.use("/",require("./Leaderboard/fetchLeaderBoard"));

router.use("/",require("./Settings/fetchSettings"));

router.use("/",require("./Groups/createGroup"));
router.use("/",require("./Groups/fetchGroups"));
router.use("/",require("./Groups/fetchGroupDetails"));
router.use("/",require("./Groups/joinGroup"));
router.use("/",require("./Groups/fetchGroupProblems"));
router.use("/",require("./Groups/fetchGroupMembers"));
router.use("/",require("./Groups/fetchGroupProblem(addtion)"));
router.use("/",require("./Groups/addQuestion"));

module.exports = router;
