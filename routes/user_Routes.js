const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  registerSeeker,
  loginSeeker,
  registerAdmin,
  loginAdmin,
  getCategories,
} = require("../controllers/users_Controller");
const { AuthUser } = require("../middlewares/user_Auth_Middleware");

// get Routes
router.get("/user", AuthUser, getUserDetails);
router.get("/categories", getCategories);

// post Routes
router.post("/register", registerSeeker);
router.post("/login", loginSeeker);
router.post("/registerAdmin", registerAdmin);
router.post("/loginAdmin", loginAdmin);

// TODO:
module.exports = router;
