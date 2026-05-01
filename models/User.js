const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },

  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 20,
    match: /^[a-z0-9_]+$/,
  },

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  emailToken: { type: String },
  isVerified: { type: Boolean, default: false },

  registerData: { type: Date, default: Date.now },

  login: [
    {
      token: { type: String, required: true },
      isActive: { type: Boolean, default: true },
      loginAt: { type: Date, default: Date.now },
      lastActiveAt: { type: Date, default: Date.now },

      deviceInfo: {
        browser: String,
        os: String,
        device: String,
        userAgent: String,
      },

      deviceLocation: {
        ip: String,
        city: String,
        region: String,
        country: String,
        coordinates: {
          lat: Number,
          lng: Number,
        },
      },
    },
  ],
});

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, SECRET_KEY);
};

module.exports = mongoose.model("User", UserSchema);
