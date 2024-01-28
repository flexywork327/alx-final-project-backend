const mongoose = require("mongoose");

const jobsAppliedSchema = mongoose.Schema(
  {
    job_id: {
      type: String,
      required: true,
    },

    company_name: {
      type: String,
      required: true,
    },

    job_title: {
      type: String,
      required: true,
    },

    job_experience: {
      type: Number,
      required: true,
    },

    job_salary: {
      type: Number,
      required: true,
    },

    job_description: {
      type: String,
      required: true,
    },

    job_type: {
      type: String,
      required: true,
    },

    job_company_email: {
      type: String,
      required: true,
    },

    user_id: {
      type: String,
      required: true,
    },

    user_name: {
      type: String,
      required: true,
    },

    user_email: {
      type: String,
      required: true,
    },

    resume: {
      type: String,
      required: true,
    },

    date_applied: {
      type: String,
      default: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },

    time_applied: {
      type: String,
      default: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Applied_Jobs", jobsAppliedSchema);
