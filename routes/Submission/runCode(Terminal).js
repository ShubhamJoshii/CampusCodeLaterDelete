const express = require("express");
const runCodeFunction = require("./runCodeFunction");

const router = express.Router();

router.post("/runcode", async (req, res) => {
  // try {
  //   const { code, language, _id : problemId } = req.body;

  //   if (!code || !language || !problemId) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "code, language, and problemId are required",
  //     });
  //   }

  //   const result = await runCodeFunction(code, language, problemId);
  //   if(!result.success){
  //     console.log(result);
  //     return res.status(500).json(result);
  //   }
  //   return res.status(200).json(result);
  // } catch (error) {
  //   return res.status(500).json({
  //     success: false,
  //     message: error.message || "Internal Server Error",
  //   });
  // }
});

module.exports = router;