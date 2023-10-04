const cloudinary = require("../utils/cloudinary");
const JobsModel = require("../model/jobs_Model");
const UserModel = require("../model/user_Model");
const Categories = require("../model/categories_Model");
const Applied_Jobs = require("../model/jobs_Applied_Model");

//todo:@ ======================================================================= GET ALL JOBS ===================================================================== //
//@route Get api/posted jobs
//@desc Get all posted jobs
//@access Public
const getJobs = async (req, res) => {
  try {
    //Get all jobs and arrange them by the latest jobs by date

    const jobs = await JobsModel.find().sort({ date: -1 });

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
    const job = await JobsModel.find({ active: false }).sort({ date: -1 });

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
    const job = await JobsModel.find({ active: true }).sort({ date: -1 });

    res.json({
      status: 200,
      message: "Successfully fetched active job(s)",
      info: job,
    });
  } catch (err) {
    res.json({
      status: 400,
      message: "Failed to fetch job(s)",
      info: err,
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
const deactivateJob = async (req, res) => {
  const { job_id } = req.body;
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
      { active: false },
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
  const {
    user_id,
    job_title,
    job_type,
    job_category,
    job_location,
    job_country,
    job_salary,
    job_experience,
    job_company_email,
    job_term,
    job_description,
    post_duration,
  } = req.body;

  try {
    const job = await JobsModel.create({
      company_uuid: user_id,
      job_title,
      job_type,
      job_category,
      job_location,
      job_country,
      job_salary,
      job_experience,
      job_company_email,
      job_term,
      job_description,
      post_duration,
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

    if (!job) {
      res.json({
        message: "Job not found",
        status: 404,
      });
    }

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

//todo:@ =======================================================================  DASHBOARD DETAILS ==================================================================== //

//@route Get api/Jobs/get_Dashboard
//@desc Get Dashboard data
//@access Private
const getDashboard = async (req, res) => {
  try {
    // find total number of jobs
    const totalJobs = await JobsModel.find({}).countDocuments();

    // find total number of active jobs
    const activeJobs = await JobsModel.find({ active: true }).countDocuments();

    // find total number of inactive jobs
    const inactiveJobs = await JobsModel.find({
      active: false,
    }).countDocuments();

    // find total number of seekers
    // const totalSeekers = await Seeker.find({}).countDocuments();

    res.json({
      status: 200,
      message: "Successfully fetched dashboard details",
      info: {
        totalJobs,
        activeJobs,
        inactiveJobs,
      },
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
  const job_category_lower = job_category.toLowerCase();

  try {
    // find job by either job_title, job_location or job_category
    const job = await JobsModel.find({
      $or: [
        { job_title: { $regex: job_title_lower, $options: "i" } },
        { job_location: { $regex: job_location_lower, $options: "i" } },
        { job_category: { $regex: job_category_lower, $options: "i" } },
      ],
      active: true,
    });

    res.status(200).json({
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
      info: applied_job,
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
  deactivateJob,
  getDashboard,
  getInactive,
  activateJob,
  JobFilter,
  getCategories,
  getActive,
  getJobs,
  createProductsCategory,
  postJob,
  ApplyForJob,
};
