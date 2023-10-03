const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    company_uuid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    job_title: {
      type: String,
      required: [true, "Please add a Job title"],
    },

    job_type: {
      type: String,
      required: [true, "Please add a Job type"],
    },

    job_category: {
      type: String,
      required: [true, "Please add a Job category"],
    },

    job_location: {
      type: String,
      required: [true, "Please add a Job location"],
    },

    job_country: {
      type: String,
      required: [true, "Please add a Job country"],
    },

    job_salary: {
      type: String,
      required: [true, "Please add a Job salary"],
    },

    job_experience: {
      type: String,
      required: [true, "Please add a Job experience"],
    },

    job_company_email: {
      type: String,
      required: [true, "Please add a Job company email"],
    },

    job_term: {
      type: String,
      required: [true, "Please add a shift"],
    },

    job_description: {
      type: String,
      required: [true, "Please add a job description"],
    },

    date: {
      type: Date,
      default: Date.now,
    },

    post_duration: {
      type: String,
      default: "30 days",
    },

    month_name: {
      // display month name of data creation in a string
      type: String,
      default: new Date().toLocaleString("en-US", {
        month: "long",
      }),
    },

    active: {
      type: String,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Jobs", jobSchema);
