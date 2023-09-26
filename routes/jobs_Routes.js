const express = require("express");
const router = express.Router();
const {
  getJobsByCategory,
  getJobDetails,
  deactivateJob,
  getDashboard,
  getInactive,
  activateJob,
  getActive,
  JobFilter,
  getJobs,
  postJob,
} = require("../controllers/job_Controller");
const { AuthUser } = require("../middlewares/user_Auth_Middleware");
const upload = require("../utils/multer");

// todo: ==================================================== GET ROUTES ====================================================

router.get("/dashboard", getDashboard);
router.get("/inactive", getInactive);
router.get("/all_jobs", getJobs);
router.get("/active", getActive);

// todo: ==================================================== POST ROUTES ====================================================

router.post("/job", upload.single("job_image"), AuthUser, postJob);
router.post("/products_by_category", getJobsByCategory);
router.post("/deactivate_job", deactivateJob);
router.post("/job_details", getJobDetails);
router.post("/activate_job", activateJob);
router.post("/job_filter", JobFilter);

module.exports = router;
