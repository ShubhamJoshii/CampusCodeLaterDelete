const express = require("express");
const router = express.Router();
const Problems = require("../../models/Problems")

router.post("/addProblem", async (req, res) => {
    try {
        const newProblem = await Problems({});
        await newProblem.save();
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;
