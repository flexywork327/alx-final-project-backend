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
  getCategories,
  getJobs,
  postJob,
  createProductsCategory,
  ApplyForJob,
} = require("../controllers/job_Controller");
const { AuthUser } = require("../middlewares/user_Auth_Middleware");
const upload = require("../utils/multer");

// todo: ==================================================== GET ROUTES ====================================================

router.get("/categories", getCategories);
router.get("/dashboard", getDashboard);
router.get("/inactive", getInactive);
router.get("/all_jobs", getJobs);
router.get("/active", getActive);
// todo: ==================================================== POST ROUTES ====================================================

router.post("/create_products_category", createProductsCategory);
router.post("/products_by_category", getJobsByCategory);
router.post("/create_job", AuthUser, postJob);
router.post("/deactivate_job", deactivateJob);
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
