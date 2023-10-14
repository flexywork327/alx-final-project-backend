const cloudinary = require("../utils/cloudinary");
const JobsModel = require("../model/jobs_Model");
const UserModel = require("../model/user_Model");
const Categories = require("../model/categories_Model");
const Applied_Jobs = require("../model/jobs_Applied_Model");
const {
  jobs_Validator,
  job_IDValidator,
  apply_for_job_Validator,
} = require("../schema-validators/jobs_Validator");
const { users_IDValidator } = require("../schema-validators/users_Validator");

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
  // const { job_id } = req.body;
  // todo: @ desc- verify the input provided
  const { error, value } = job_IDValidator.validate(req.body);
  if (error) {
    return res.json({
      status: 400,
      message: error.details[0].message,
    });
  }

  try {
    const job = await JobsModel.findById(value.job_id);

    if (!job) {
      return res.json({
        message: "Job not found",
        status: 404,
      });
    }

    return res.json({
      status: 200,
      message: "Successfully fetched job details",
      info: job,
    });
  } catch (err) {
    return res.json({
      status: 400,
      message: err.message,
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

    return res.json({
      status: 200,
      message: "Successfully fetched jobs by category",
      info: job,
    });
  } catch (err) {
    return res.json({
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
    // find jobs that match all two criteria
    const job = await JobsModel.find({
      job_title: { $regex: job_title_lower, $options: "i" },
      job_location: { $regex: job_location_lower, $options: "i" },
      status: "active",
    });

    return res.json({
      status: 200,
      message: "Job retrieved successfully",
      info: job,
    });
  } catch (error) {
    return res.json({
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

    return res.json({
      status: 200,
      message: "Categories retrieved successfully",
      info: categories,
    });
  } catch (error) {
    return res.json({
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

    return res.json({
      status: 201,
      message: "Category created successfully",
      info: category,
    });
  } catch (error) {
    return res.json({
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
  const file = req.files;
  console.log(file);
  // todo: @ desc- verify the input provided
  const { error, value } = apply_for_job_Validator.validate(req.body);
  if (error) {
    return res.json({
      status: 400,
      message: error.details[0].message,
    });
  }

  // check if file is present
  if (!file) {
    return res.json({
      status: 400,
      message: "No file uploaded",
    });
  }

  try {
    const job = await JobsModel.findById(value.job_id);

    if (!job) {
      return res.json({
        status: 404,
        message: "Job not found",
      });
    }

    const user = await UserModel.findById(value.user_id);

    if (!user) {
      return res.json({
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
      job_id: value.job_id,
      job_title: job.job_title,
      job_experience: job.job_experience,
      job_salary: job.job_salary,
      job_description: job.job_description,
      job_type: job.job_type,
      job_company_email: job.job_company_email,
      company_name: job.job_company_name,
      user_id: value.user_id,
      user_name: `${user.first_name} ${user.last_name}`,
      user_email: `${user.email}`,
      resume: result.secure_url,
    });

    return res.json({
      status: 200,
      message: `Successfully applied for ${job.job_title} job`,
      info: applied_job,
    });
  } catch (error) {
    return res.json({
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
  // todo: @ desc- verify the input provided
  const { error, value } = users_IDValidator.validate(req.body);
  if (error) {
    return res.json({
      status: 400,
      message: error.details[0].message,
    });
  }

  try {
    // find all jobs applied by user
    const applied_jobs = await Applied_Jobs.find({ user_id: value.user_id });

    if (applied_jobs.length === 0) {
      return res.json({
        status: 404,
        message: "No jobs found",
      });
    } else {
      return res.json({
        status: 200,
        message: "Successfully fetched all applied jobs",
        info: applied_jobs,
      });
    }
  } catch (error) {
    return res.json({
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

    return res.json({
      status: 200,
      message: "Successfully fetched jobs by preference",
      info: jobs,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
};

// todo: @ =======================================================================  GET USER JOB DASHBOARD  =================================================================== //
// @Desc Get user job dashboard
// @route POST /api/shopper/get_user_job_dashboard

const GetUserJobDashboard = async (req, res) => {
  // todo: @ desc- verify the input provided
  const { error, value } = users_IDValidator.validate(req.body);
  if (error) {
    return res.json({
      status: 400,
      message: error.details[0].message,
    });
  }

  try {
    //* get total number of jobs posted by user and arrange them by the latest jobs by date
    const total_jobs = await JobsModel.find({ company_uuid: value.user_id })
      .sort({
        date: -1,
      })
      .countDocuments();

    //* get total number of active jobs posted by user and arrange them by the latest jobs by date
    const activeJobs = await JobsModel.find({
      company_uuid: value.user_id,
      status: "active",
    })
      .sort({ date: -1 })
      .countDocuments();

    //* get total number of inactive jobs posted by user and arrange them by the latest jobs by date
    const inactiveJobs = await JobsModel.find({
      company_uuid: value.user_id,
      status: "inactive",
    })
      .sort({ date: -1 })
      .countDocuments();

    return res.json({
      status: 200,
      message: "Successfully fetched user job dashboard",
      info: {
        total_jobs,
        activeJobs,
        inactiveJobs,
      },
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
};

// todo: @ =======================================================================  GET JOB APPLIED DETAILS  =================================================================== //
// @Desc Get job applied details
// @route POST /api/shopper/view_job_applied_details
// @access private

const getJobAppliedDetails = async (req, res) => {
  const { error, value } = job_IDValidator.validate(req.body);
  if (error) {
    return res.json({
      status: 400,
      message: error.details[0].message,
    });
  }

  try {
    const job = await Applied_Jobs.findById(value.job_id);

    if (!job) {
      return res.json({
        status: 404,
        message: "Job not found",
      });
    }

    return res.json({
      status: 200,
      message: "Successfully fetched job details",
      info: job,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
};

module.exports = {
  getAllJobsAppliedByUser,
  createProductsCategory,
  getJobAppliedDetails,
  GetUserJobDashboard,
  getJobsPostedByUser,
  getJobsByCategory,
  JobsByPreference,
  ChangeJobStatus,
  getCategories,
  getJobDetails,
  getInactive,
  activateJob,
  ApplyForJob,
  JobFilter,
  getActive,
  postJob,
};
