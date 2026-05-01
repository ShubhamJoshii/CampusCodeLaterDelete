const validator = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err.issues) {
      // console.log(err.issues);
      return res.status(400).send({
        msg: { message: err.issues[0].message, target: err.issues[0].path[0] },
        success: false,
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = validator;
