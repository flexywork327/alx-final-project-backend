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

    job_company_name: {
      type: String,
      required: [true, "Please add a Job company name"],
    },

    job_description: {
      type: String,
      required: [true, "Please add a job description"],
    },

    status: {
      type: String,
      default: "active",
    },

    date: {
      type: Date,
      default: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Jobs", jobSchema);
