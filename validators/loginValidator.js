const { z } = require("zod");

const loginValidator = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email"),

  password: z
    .string()
    .min(1, "Password is required"),
});

module.exports = loginValidator;