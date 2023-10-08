const cloudinary = require("../utils/cloudinary");
const JobsModel = require("../model/jobs_Model");
const UserModel = require("../model/user_Model");
const Categories = require("../model/categories_Model");
const Applied_Jobs = require("../model/jobs_Applied_Model");
const { jobs_Validator } = require("../schema-validators/jobs_Validator");

//todo:@ ======================================================================= GET ALL JOBS ===================================================================== //
//@route Get api/posted jobs
//@desc Get all posted jobs
//@access Public
const getJobsPostedByUser = async (req, res) => {
  const { user_id } = req.body;

  try {
    //Get all jobs and arrange them by the latest jobs by date

    const jobs = await JobsModel.find({ company_uuid: user_id }).sort({
      date: -1,
    });

    res.json({
      status: 200,
      message: "Successfully fetched all posted jobs",
      info: jobs,
    });
  } catch (error) {
    res.json({
      message: "Failed to fetch all posted jobs",
      status: 400,
      info: error.message,
    });
  }
};

//todo:@ ======================================================================= GET INACTIVE JOBS ================================================================ //

//@route Get api/admin/inactive
//@desc Get inactive jobs
//@access Private
const getInactive = async (req, res) => {
  try {
    const job = await JobsModel.find({ status: "inactive" }).sort({ date: -1 });

    res.json({
      status: 200,
      message: "Successfully fetched inactive job(s)",
      info: job,
    });
  } catch (err) {
    res.json({
      status: 400,
      message: "Failed to fetch inactive job(s)",
      info: err,
    });
  }
};

//todo: @ ======================================================================= GET ACTIVE JOBS ================================================================== //

//@route Get api/Jobs/active
//@desc Get active jobs
//@access Private
const getActive = async (req, res) => {
  try {
    const job = await JobsModel.find({ status: "active" }).sort({ date: -1 });

    res.json({
      status: 200,
      message: "Successfully fetched active job(s)",
      info: job,
    });
  } catch (err) {
    res.json({
      status: 400,
      message: err.message,
    });
  }
};

//todo: @ =======================================================================  ACTIVATE JOBS =================================================================== //

//@ desc activate an item
//@ Post api/admin/activate_job
//private
const activateJob = async (req, res) => {
  const { job_id } = req.body;
  try {
    const job = await JobsModel.findById(job_id);

    //find by id and update
    const updatedJob = await JobsModel.findByIdAndUpdate(
      req.body.job_id,
      { active: true },
      { new: true }
    );

    //send response
    res.json({
      status: 200,
      message: "Successfully activated job",
      info: updatedJob,
    });
  } catch (err) {
    res.json({
      message: "Failed to activate job",
      status: 400,
      info: err,
    });
  }
};

//todo:@ ======================================================================= DEACTIVATE JOBS ================================================================== //

//@route Deactivate an item
//@ Post api/admin/deactivate_job
//private
const ChangeJobStatus = async (req, res) => {
  const { job_id, status_flag } = req.body;
  try {
    const job = await JobsModel.findById(job_id);

    if (!job) {
      res.json({
        message: "Job not found",
        status: 400,
      });
    }

    //find by id and update
    const updatedJob = await JobsModel.findByIdAndUpdate(
      job._id,
      { status: status_flag },
      { new: true }
    );

    res.json({
      status: 200,
      message: "Successfully deactivated job",
      info: updatedJob,
    });
  } catch (err) {
    res.json({
      status: 400,
      message: "Failed to deactivate job",
      info: err,
    });
  }
};

//todo: @ ======================================================================= POST JOBS ======================================================================== //

//@route Post api/Jobs
//@desc Add product
//@access Public
const postJob = async (req, res) => {
  // todo: @ desc- verify the input provided
  const { error, value } = jobs_Validator.validate(req.body);
  if (error) {
    return res.json({
      status: 400,
      message: error.details[0].message,
    });
  }

  try {
    const job = await JobsModel.create({
      company_uuid: value.user_id,
      job_title: value.job_title,
      job_type: value.job_type,
      job_category: value.job_category,
      job_location: value.job_location,
      job_salary: value.job_salary,
      job_experience: value.job_experience,
      job_company_email: value.job_company_email,
      job_company_name: value.job_company_name,
      job_description: value.job_description,
    });

    res.json({
      status: 201,
      message: "Successfully added a new job post",
      info: job,
    });
  } catch (err) {
    res.json({
      message: "Failed to add job post",
      status: 400,
      info: err.message,
    });
  }
};

//todo: @ =======================================================================  JOBS DETAILS ==================================================================== //

//@route Get api/Jobs/
//@desc Get single job
//@access Private
const getJobDetails = async (req, res) => {
  const { job_id } = req.body;
  try {
    const job = await JobsModel.findById(job_id);

    // if (!job) {
    //   res.json({
    //     message: "Job not found",
    //     status: 404,
    //   });
    // }

    res.json({
      status: 200,
      message: "Successfully fetched job details",
      info: job,
    });
  } catch (err) {
    res.json({
      status: 400,
      message: "Failed to fetch job details",
      info: err.message,
    });
  }
};

//todo: @ =======================================================================  PRODUCT BY CATEGORIES DETAILS ==================================================================== //

//@route Get api/ProductByCategory/
//@desc Get products by category
//@access Private
const getJobsByCategory = async (req, res) => {
  const { job_category } = req.body;
  try {
    const job = await JobsModel.find({ job_category });

    res.json({
      status: 200,
      message: "Successfully fetched jobs by category",
      info: job,
    });
  } catch (err) {
    res.json({
      status: 400,
      message: "Failed to fetch job details",
      info: err.message,
    });
  }
};

//todo: @ =======================================================================  SEARCH FUNCTION  =================================================================== //

//@desc Get job by keyword,location and category
//@route Post /api/shopper/job_filter
//@access public
const JobFilter = async (req, res) => {
  const { job_title, job_location, job_category } = req.body;

  //convert to lowercase
  const job_title_lower = job_title.toLowerCase();
  const job_location_lower = job_location.toLowerCase();

  try {
    // find job by either job_title, job_location or job_category
    // const job = await JobsModel.find({
    //   $or: [
    //     { job_title: { $regex: job_title_lower, $options: "i" } },
    //     { job_location: { $regex: job_location_lower, $options: "i" } },
    //     { job_category: { $regex: job_category_lower, $options: "i" } },
    //   ],
    //   status: "active",
    // });

    // find jobs that match all two criteria
    const job = await JobsModel.find({
      job_title: { $regex: job_title_lower, $options: "i" },
      job_location: { $regex: job_location_lower, $options: "i" },
      status: "active",
    });

    res.json({
      status: 200,
      message: "Job retrieved successfully",
      info: job,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error,
    });
  }
};

//todo:@ =======================================================================  CATEGORIES  =================================================================== //

// @Desc Get all categories
// @route GET /api/shopper/categories
// @access public
const getCategories = async (req, res) => {
  try {
    const categories = await Categories.find();

    res.json({
      status: 200,
      message: "Categories retrieved successfully",
      info: categories,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
};

// todo: @ =======================================================================  CREATE PRODUCTS CATEGORY  =================================================================== //
// @Desc Create products category
// @route POST /api/admin/create_products_category
// @access private

const createProductsCategory = async (req, res) => {
  const { category_name } = req.body;

  try {
    const category = await Categories.create({
      category_name,
    });

    res.json({
      status: 201,
      message: "Category created successfully",
      info: category,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
};

// todo: @ =======================================================================  APPLY FOR JOB  =================================================================== //
// @Desc Apply for job
// @route POST /api/shopper/apply_for_job
// @access private

const ApplyForJob = async (req, res) => {
  const { job_id, user_id } = req.body;
  const file = req.files;
  console.log(file);

  try {
    const job = await JobsModel.findById(job_id);

    if (!job) {
      res.json({
        status: 404,
        message: "Job not found",
      });
    }

    const user = await UserModel.findById(user_id);

    if (!user) {
      res.json({
        status: 404,
        message: "User not found",
      });
    }

    // upload file to cloudinary
    const result = await cloudinary.uploader.upload(file.resume[0].path, {
      resource_type: "auto",
      folder: "jobseeker",
    });

    // store in database
    const applied_job = await Applied_Jobs.create({
      job_id,
      user_id,
      resume: result.secure_url,
    });

    res.json({
      status: 200,
      message: "Successfully applied for job",
      // info: applied_job,
      info: result,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
};

// todo: @ =======================================================================  GET ALL APPLIED JOBS  =================================================================== //
// @Desc Get all applied jobs
// @route POST /api/v1/get_all_jobs_applied_by_user
// @access private

const getAllJobsAppliedByUser = async (req, res) => {
  const { user_id } = req.body;
  try {
    // find all jobs applied by user
    const applied_jobs = await Applied_Jobs.find({ user_id });

    if (applied_jobs.length === 0) {
      res.json({
        status: 404,
        message: "No jobs found",
      });
    } else {
      res.json({
        status: 200,
        message: "Successfully fetched all applied jobs",
        info: applied_jobs,
      });
    }
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
};

// todo: @ =======================================================================  GET JOBS BY PREFERENCE  =================================================================== //
// @Desc Get jobs by preference
// @route POST /api/shopper/get_jobs_by_preference
// @access private

const JobsByPreference = async (req, res) => {
  const { job_category, job_location } = req.body;

  try {
    const jobs = await JobsModel.find({
      $or: [
        { job_category: { $regex: job_category, $options: "i" } },
        { job_location: { $regex: job_location, $options: "i" } },
      ],
    });

    res.json({
      status: 200,
      message: "Successfully fetched jobs by preference",
      info: jobs,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
};

// todo: @ =======================================================================  GET USER JOB DASHBOARD  =================================================================== //
// @Desc Get user job dashboard
// @route POST /api/shopper/get_user_job_dashboard

const GetUserJobDashboard = async (req, res) => {
  const { user_id } = req.body;

  try {
    // const jobs = await JobsModel.find({ company_uuid: user_id });
    // get total number of jobs posted by user and arrange them by the latest jobs by date
    const total_jobs = await JobsModel.find({ company_uuid: user_id })
      .sort({
        date: -1,
      })
      .countDocuments();

    // get total number of active jobs posted by user and arrange them by the latest jobs by date
    const activeJobs = await JobsModel.find({
      company_uuid: user_id,
      status: "active",
    })
      .sort({ date: -1 })
      .countDocuments();

    // get total number of inactive jobs posted by user and arrange them by the latest jobs by date
    const inactiveJobs = await JobsModel.find({
      company_uuid: user_id,
      status: "inactive",
    })
      .sort({ date: -1 })
      .countDocuments();

    res.json({
      status: 200,
      message: "Successfully fetched user job dashboard",
      info: {
        total_jobs,
        activeJobs,
        inactiveJobs,
      },
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
};

module.exports = {
  getJobsByCategory,
  getJobDetails,
  ChangeJobStatus,
  getInactive,
  activateJob,
  JobFilter,
  getCategories,
  GetUserJobDashboard,
  getActive,
  getJobsPostedByUser,
  createProductsCategory,
  postJob,
  ApplyForJob,
  getAllJobsAppliedByUser,
  JobsByPreference,
};
