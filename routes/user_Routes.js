const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  setUpdateProfile,
  setJobPreference,
  registerSeeker,
  loginSeeker,
} = require("../controllers/users_Controller");
const upload = require("../utils/multer");

// const { AuthUser } = require("../middlewares/user_Auth_Middleware");

// todos: ================================================================= post Routes =================================================================
router.post(
  "/update_profile",
  upload.fields([
    {
      name: "resume",
      maxCount: 1,
    },
  ]),
  setUpdateProfile
);

router.post("/set_preference", setJobPreference);
router.post("/user_details", getUserDetails);
router.post("/register", registerSeeker);
router.post("/login", loginSeeker);

// TODO:
module.exports = router;
