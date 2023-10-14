const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  setJobPreference,
  registerSeeker,
  loginSeeker,
} = require("../controllers/users_Controller");
// const { AuthUser } = require("../middlewares/user_Auth_Middleware");

// todos: ================================================================= post Routes =================================================================
router.post("/set_preference", setJobPreference);
router.post("/user_details", getUserDetails);
router.post("/register", registerSeeker);
router.post("/login", loginSeeker);

// TODO:
module.exports = router;
