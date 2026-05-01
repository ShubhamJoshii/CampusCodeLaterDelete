const express = require("express");
const Problems = require("../../models/Problems");
const buildJavaInput = require("../../util/buildJavaInput");
const router = express.Router();

router.get("/problemDetails/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const problem = await Problems.findById(_id, "-judgeCode").lean();
    const testCases = problem.testCases.map((tc) => {
      const inputStr =
        typeof tc.input === "string"
          ? tc.input
          : Object.entries(tc.input)
              .map(([key, value]) => `${key} = ${JSON.stringify(value)}`)
              .join(", ");

      const outputStr = `${JSON.stringify(tc.output)}`;

      return {
        input: inputStr,
        output: outputStr,
      };
    });
    const results = [];

    for (const tc of problem.testCases) {
      // console.log(tc);
      const input = buildJavaInput(tc, problem.tags[0]);
      results.push({
        input,
        expected: "",
        actual: "",
        passed: null,
      });
    }
    // console.log(results);

    res.status(200).json({
      success: true,
      data: { ...problem, testCases, results },
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
