const express = require("express");
const router = express.Router();
const {
  getAllJobsAppliedByUser,
  createProductsCategory,
  getJobsPostedByUser,
  GetUserJobDashboard,
  getJobsByCategory,
  JobsByPreference,
  ChangeJobStatus,
  getCategories,
  getJobDetails,
  getInactive,
  ApplyForJob,
  activateJob,
  JobFilter,
  getActive,
  postJob,
} = require("../controllers/job_Controller");
const upload = require("../utils/multer");
const { AuthUser } = require("../middlewares/user_Auth_Middleware");

// todo: ==================================================== GET ROUTES ====================================================

router.get("/categories", getCategories);
router.get("/inactive", getInactive);
router.get("/active", getActive);

// todo: ==================================================== POST ROUTES ====================================================

router.post("/create_products_category", AuthUser, createProductsCategory); // create categories

router.post("/get_all_jobs_applied_by_user", AuthUser, getAllJobsAppliedByUser);
router.post("/change_job_status", AuthUser, ChangeJobStatus);
router.post("/get_user_job_dashboard", GetUserJobDashboard);
router.post("/get_jobs_by_preference", JobsByPreference);
router.post("/products_by_category", getJobsByCategory);
router.post("/all_jobs_by_user", getJobsPostedByUser);
router.post("/get_job_details", getJobDetails);
router.post("/activate_job", activateJob);
router.post("/job_search", JobFilter);
router.post("/create_job", AuthUser, postJob);
router.post(
  "/apply_for_job",
  AuthUser,
  upload.fields([
    {
      name: "resume",
      maxCount: 1,
    },
  ]),
  ApplyForJob
);

module.exports = router;
