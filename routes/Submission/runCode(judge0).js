const express = require("express");
const router = express.Router();
const Problems = require("../../models/Problems");
const axios = require("axios");

router.post("/runcode", async (req, res) => {
  const { code , language, _id } = req.body;
  console.log(code, language, _id);
  const languageId = language === "java" ? 62 : 54;
  try {
    const problem = await Problems.findById(_id);
    // console.log(problem);
    const options = {
      method: "POST",
      url: "http://localhost:2358/submissions",
      params: { base64_encoded: "true", wait: "false" },
      data: {
        language_id: languageId,
        source_code: Buffer.from(code).toString("base64"),
        stdin: Buffer.from(problem.testCases[0].input).toString("base64"),
        expected_output: Buffer.from(problem.testCases[0].output).toString(
          "base64",
        ),
      },
    };
    const response = await axios.request(options);
    console.log(response.data.token);
    // 3. Save the "In Progress" submission to your DB
    // const newSubmission = await Submission.create({
    //   userId: req.user.id,
    //   problemId,
    //   token: response.data.token, // This is key!
    //   status: "Processing",
    // });

    // 4. Send token to Frontend
    res.status(201).json({ token: response.data.token });
  } catch (error) {
    console.log(error)
    res.send({ data: "Error" });
  }
});

module.exports = router;
