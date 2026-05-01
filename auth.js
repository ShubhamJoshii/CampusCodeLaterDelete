const express = require("express");
const router = express.Router();

const { UserModel } = require("./database");

const env = process.env.NODE_ENV;

router.get("/userExist/:email", async (req, res) => {
  const email = req.params.email;
  // console.log(email);
  try {
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.send({
        success: true,
        msg: "User Exist",
      });
    }
    throw new ValidationError("email", "Email not exists!");
  } catch (error) {
    return res.status(400).send({
      msg: { message: error.message, target: error.target },
      success: false,
    });
  }
});

module.exports = router;
