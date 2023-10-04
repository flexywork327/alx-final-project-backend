const mongoose = require("mongoose");

const jobsAppliedSchema = mongoose.Schema(
  {
    job_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Applied_Jobs", jobsAppliedSchema);
