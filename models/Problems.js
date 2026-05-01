const mongoose = require("mongoose");

const TestCaseSchema = new mongoose.Schema(
  {
    input: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: true },
);

const ProblemSchema = new mongoose.Schema(
  {
    sno: {
      type: Number,
      unique: true,
    },
    problemType: String,
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    tags: [String],

    defaultCode: {
      java: { type: String, required: true },
      cpp: { type: String, required: true },
    },

    judgeCode: {
      java: { type: String, required: true },
      cpp: { type: String, required: true },
    },

    testCases: [TestCaseSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Problem", ProblemSchema);
