const Categories = require("../models/categories_Model");
const JobsModel = require("../models/jobs_Model");
const UserModel = require("../models/user_Model");
const cloudinary = require("../utils/cloudinary");
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  users_Validator,
  login_Validator,
  users_IDValidator,
  updateProfile_Validator,
} = require("../validators/users_Validator");

//todo:@ =======================================================================  GET USER DETAILS =================================================================== //

//@desc Get user details
//@route GET /api/seeker/user
//@access private
const getUserDetails = async (req, res) => {
  // todo: @ desc- verify the input provided
  const { error, value } = users_IDValidator.validate(req.body);
  if (error) {
    return res.json({
      status: 400,
      message: error.details[0].message,
    });
  }

  try {
    const user = await UserModel.findById(value.user_id);

    return res.json({
      status: 200,
      message: "User details",
      info: user,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
};

//todo: @ =======================================================================  LOGIN USER  =================================================================== //

// desc Login User
// @route Post /api/seeker/login
// @access public
const loginSeeker = async (req, res) => {
  // todo: @ desc- verify the input provided
  const { error, value } = login_Validator.validate(req.body);
  if (error) {
    return res.json({
      status: 400,
      message: error.details[0].message,
    });
  }

  try {
    // check if user exists
    const userExists = await UserModel.findOne({ email: value.email });

    if (!userExists) {
      return res.json({
        status: 400,
        message: "User email does not exist",
      });
    }

    // check if password is correct
    const isMatch = await bcrypt.compare(value.password, userExists.password);

    if (!isMatch) {
      return res.json({
        status: 400,
        message: "Incorrect password",
      });
    }

    return res.json({
      status: 200,
      message: "Login successful",
      info: userExists,
      token: generateToken(userExists._id),
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
};

//TODO: ======================================================== Register User ========================================================

// desc Register Admin
// @route post /admin/register
// @access public
const registerSeeker = async (req, res) => {
  // todo: @ desc- verify the input provided
  const { error, value } = users_Validator.validate(req.body);
  if (error) {
    return res.json({
      status: 400,
      message: error.details[0].message,
    });
  }

  try {
    // check if user exists
    const userExists = await UserModel.findOne({ email: value.email });

    if (userExists) {
      return res.json({
        status: 400,
        message: "Account exist with same email address",
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(value.password, salt);

    // create User
    const user = await UserModel.create({
      first_name: value.first_name,
      last_name: value.last_name,
      email: value.email,
      password: hashPassword,
      role: value.role,
    });

    return res.json({
      status: 201,
      message: "User created successfully",
      info: user,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
};

// todo:@ =======================================================================  SET JOB PREFERENCE  =================================================================== //
// desc Set Job Preference
// @route Post /api/seeker/set_preference
// @access private

const setJobPreference = async (req, res) => {
  const { user_id, job_preference } = req.body;

  try {
    // check if user exists
    const userExists = await UserModel.findById(user_id);

    if (!userExists) {
      res.json({
        status: 400,
        message: "User does not exist",
      });
    }

    // create User
    const user = await UserModel.findByIdAndUpdate(
      user_id,
      {
        preferences: job_preference,
        isPreferenceSelected: true,
      },
      { new: true }
    );

    res.json({
      status: 200,
      message: "Job preference set successfully",
      info: user,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
};

// todo:@ =======================================================================  UPDATE PROFILE  =================================================================== //
// desc Update Profile
// @route Post /api/seeker/update_profile
// @access private

const setUpdateProfile = async (req, res) => {
  const file = req.files;
  console.log(file);
  const { error, value } = updateProfile_Validator.validate(req.body);
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
    // check if user exists
    const userExists = await UserModel.findById(value.user_id);

    if (!userExists) {
      res.json({
        status: 400,
        message: "User does not exist",
      });
    }

    // upload file to cloudinary
    const result = await cloudinary.uploader.upload(file.resume[0].path, {
      resource_type: "auto",
      folder: "seeker",
    });

    // create User
    const user = await UserModel.findByIdAndUpdate(
      value.user_id,
      {
        first_name: value.first_name,
        last_name: value.last_name,
        location: value.location,
        resume: result.secure_url,
        experience: value.experience,
      },
      { new: true }
    );

    res.json({
      status: 200,
      message: "Profile updated successfully",
      info: user,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
};

//todo:@ =======================================================================  TOKEN GENERATION  =================================================================== //

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "12hr" });
};

module.exports = {
  getUserDetails,
  registerSeeker,
  loginSeeker,
  generateToken,
  setJobPreference,
  setUpdateProfile,
};
