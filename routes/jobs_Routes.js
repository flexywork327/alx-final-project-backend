const express = require("express");
const router = express.Router();
const {
  createProductsCategory,
  getJobsPostedByUser,
  GetUserJobDashboard,
  getAllAppliedJobs,
  getJobsByCategory,
  JobsByPreference,
  ChangeJobStatus,
  getCategories,
  getJobDetails,
  getDashboard,
  getInactive,
  ApplyForJob,
  activateJob,
  JobFilter,
  getActive,
  postJob,
} = require("../controllers/job_Controller");
const { AuthUser } = require("../middlewares/user_Auth_Middleware");
const upload = require("../utils/multer");

// todo: ==================================================== GET ROUTES ====================================================

router.get("/get_all_applied_jobs", getAllAppliedJobs);
router.get("/categories", getCategories);
router.get("/dashboard", getDashboard);
router.get("/inactive", getInactive);
router.get("/active", getActive);

// todo: ==================================================== POST ROUTES ====================================================

router.post("/create_products_category", createProductsCategory);
router.post("/get_user_job_dashboard", GetUserJobDashboard);
router.post("/get_jobs_by_preference", JobsByPreference);
router.post("/products_by_category", getJobsByCategory);
router.post("/all_jobs_by_user", getJobsPostedByUser);
router.post("/create_job", AuthUser, postJob);
router.post("/change_job_status", ChangeJobStatus);
router.post("/job_details", getJobDetails);
router.post("/activate_job", activateJob);
router.post("/job_search", JobFilter);
router.post(
  "/apply_for_job",
  upload.fields([
    {
      name: "resume",
      maxCount: 1,
    },
    // {
    //   name: "cover_letter",
    //   maxCount: 1,
    // },
  ]),
  ApplyForJob
);

module.exports = router;
