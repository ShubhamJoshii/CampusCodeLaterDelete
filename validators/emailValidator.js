const { z } = require("zod");

const emailValidator = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email"),
});

module.exports = emailValidator;