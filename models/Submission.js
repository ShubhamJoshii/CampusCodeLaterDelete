const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: false,
      index: true,
    },
    
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },

    code: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Accepted", "Wrong Answer", "TLE", "Runtime Error"],
      default: "Runtime Error",
      index: true,
    },

    pointEarned: {
      type: Number,
      default: 0,
    },

    runtime: {
      type: Number, // ms
      default: 0,
    },

    memory: {
      type: Number, // KB or MB (choose one and stick to it)
      default: 0,
    },

    testCasesPassed: {
      type: Number,
      default: 0,
    },

    totalTestCases: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", SubmissionSchema);