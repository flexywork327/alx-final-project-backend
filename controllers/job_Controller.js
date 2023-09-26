const cloudinary = require("../utils/cloudinary");
const JobsModel = require("../model/jobs_Model");
const UserModel = require("../model/user_Model");

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
  const files = req.files;
  const {
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
    date,
    post_duration,
  } = req.body;

  if (files === null) {
    res.json({
      message: "No file selected",
      status: 400,
    });
  }

  try {
    // using cloudinary to upload images to the cloud in a folder called jobya
    const result = await cloudinary.uploader.upload(files.path, {
      upload_preset: "jobya",
    });
    // get the company id from the token payload in the userAuth middleware page
    const company_id = verified_user._id;

    //check if the job poster exist
    const companyExist = await UserModel.findOne({ company_id });

    if (!companyExist) {
      res.json({
        message: "Please login to post an item ",
        status: 400,
      });
    }

    const job = await JobsModel.create({
      company_uuid: company_id,
      job_image: result.secure_url,
      job_title,
      job_type,
      job_category,
      job_location,
      job_country,
      job_salary,
      job_experience,
      job_company_email,
      job_company_phone,
      job_term,
      job_description,
      date,
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
    const job = await JobsModel.find({
      job_title: { $regex: job_title_lower, $options: "i" },
      job_location: { $regex: job_location_lower, $options: "i" },
      job_category: { $regex: job_category_lower, $options: "i" },
      active: "true",
    });

    res.status(200).json({
      status: 200,
      message: "Job retrieved successfully",
      job,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error,
    });
  }
};

// // an algorithm to display jobs to the user based on the user's location
// const job = await JobsModel.find({
//   job_location: { $regex: job_location_lower, $options: "i" },
//   active: "true",
// });

// // an algorithm to display jobs to the user based on the user's location and category
// const job = await JobsModel.find({
//   job_location: { $regex: job_location_lower, $options: "i" },
//   job_category: { $regex: job_category_lower, $options: "i" },
//   active: "true",
// });

module.exports = {
  getJobsByCategory,
  getJobDetails,
  deactivateJob,
  getDashboard,
  getInactive,
  activateJob,
  JobFilter,
  getActive,
  getJobs,
  postJob,
};
