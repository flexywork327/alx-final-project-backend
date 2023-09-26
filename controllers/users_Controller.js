const Categories = require("../model/categories_Model");
const JobsModel = require("../model/jobs_Model");
const UserModel = require("../model/user_Model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
JWT_SECRET = process.env.JWT_SECRET;

//todo:@ =======================================================================  GET USER DETAILS =================================================================== //

//@desc Get user details
//@route GET /api/shopper/user
//@access private
const getUserDetails = async (req, res) => {
  const { user_id } = req.body;
  try {
    const user = await UserModel.findById(user_id);

    res.json({
      status: 200,
      message: "User details",
      info: user,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
};

//todo:@ =======================================================================  REGISTER USER  =================================================================== //

// desc Register User
// @route Post /api/shopper
// @access public
const registerSeeker = async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;

  try {
    // check if user exists
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      res.json({
        status: 400,
        message: "Account exist with same email address",
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // create User
    const user = await UserModel.create({
      first_name,
      last_name,
      email,
      password: hashPassword,
      role,
    });

    res.json({
      status: 201,
      message: "User created successfully",
      info: user,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
};

//todo: @ =======================================================================  LOGIN USER  =================================================================== //

// desc Login User
// @route Post /api/shopper/login
// @access public
const loginSeeker = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exists
    const userExists = await UserModel.findOne({ email });

    if (!userExists) {
      res.json({
        status: 400,
        message: "User email does not exist",
      });
    }

    // check if password is correct
    const isMatch = await bcrypt.compare(password, userExists.password);

    if (!isMatch) {
      res.json({
        status: 400,
        message: "Incorrect password",
      });
    }

    res.json({
      status: 200,
      message: "Login successful",
      info: userExists,
      token: generateToken(userExists._id),
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
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

//todo:@ =======================================================================  TOKEN GENERATION  =================================================================== //

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1hr" });
};

module.exports = {
  getUserDetails,
  registerSeeker,
  loginSeeker,
  getCategories,
  generateToken,
};
