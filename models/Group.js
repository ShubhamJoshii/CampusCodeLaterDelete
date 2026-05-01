const mongoose = require("mongoose");
const crypto = require("crypto");

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    problems: [
      {
        problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
        schedule: { type: Date, default: Date.now },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    invitationCode: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

GroupSchema.pre("save", function () {
  if (!this.invitationCode) {
    this.invitationCode = crypto.randomBytes(4).toString("hex");
  }
});

module.exports = mongoose.model("Group", GroupSchema);
