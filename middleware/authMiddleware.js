const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.LeetCodeToken;

    if (!token) {
      return res.status(401).send({
        message: "Unauthorized: No token provided",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, SECRET_KEY);

    // ✅ Match token with login session
    const user = await UserModel.findOne({
      _id: decoded._id,
      "login.token": token,
    });

    if (!user) {
      return res.status(401).send({
        message: "Unauthorized: Session not found",
      });
    }

    // ✅ (Optional but recommended) update lastActiveAt
    await UserModel.updateOne(
      {
        _id: user._id,
        "login.token": token,
      },
      {
        $set: {
          "login.$.lastActiveAt": new Date(),
        },
      }
    );

    req.token = token;
    req.rootUser = user;
    req.userID = user._id;

    next();
  } catch (err) {
    return res.status(401).send({
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;