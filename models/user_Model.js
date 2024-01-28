const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please add a first name"],
    },

    last_name: {
      type: String,
      required: [true, "Please add a last name"],
    },

    location: {
      type: String,
      default: "N/A",
    },

    email: {
      type: String,
      required: [true, "Please add a user email"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Please add a Password "],
    },

    resume: {
      type: String,
      default: "N/A",
    },

    experience: {
      type: String,
      default: "N/A",
    },

    isPreferenceSelected: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      default: "seeker",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
