const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  registerSeeker,
  loginSeeker,
  registerAdmin,
  loginAdmin,
} = require("../controllers/users_Controller");
const { AuthUser } = require("../middlewares/user_Auth_Middleware");

// todos: ================================================================= post Routes =================================================================
router.post("/user", AuthUser, getUserDetails);
router.post("/registerAdmin", registerAdmin);
router.post("/register", registerSeeker);
router.post("/loginAdmin", loginAdmin);
router.post("/login", loginSeeker);

// TODO:
module.exports = router;
