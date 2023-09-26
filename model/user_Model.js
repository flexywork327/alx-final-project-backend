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
    },

    skills: {
      type: String,
    },

    experience: {
      type: String,
    },

    applied_jobs: {
      type: Array,
      default: [],
    },

    saved_jobs: {
      type: Array,
      default: [],
    },

    preferences: {
      type: Array,
      default: [],
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
