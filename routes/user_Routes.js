const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  setJobPreference,
  registerSeeker,
  loginSeeker,
  registerAdmin,
} = require("../controllers/users_Controller");
const { AuthUser } = require("../middlewares/user_Auth_Middleware");

// todos: ================================================================= post Routes =================================================================
router.post("/set_preference", AuthUser, setJobPreference);
router.post("/user_details", AuthUser, getUserDetails);
router.post("/registerAdmin", registerAdmin);
router.post("/register", registerSeeker);
router.post("/login", loginSeeker);

// TODO:
module.exports = router;
