const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  registerSeeker,
  loginSeeker,
  getCategories,
} = require("../controllers/users_Controller");
const { AuthUser } = require("../middlewares/user_Auth_Middleware");

router.get("/user", AuthUser, getUserDetails);
router.get("/categories", getCategories);

router.post("/register", registerSeeker);
router.post("/login", loginSeeker);

module.exports = router;
