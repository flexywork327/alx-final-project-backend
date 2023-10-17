const Joi = require("joi");

// todo: ===================================================== validation for adding jobs =====================================================

const users_Validator = Joi.object({
  first_name: Joi.string().required().min(3).max(30),
  last_name: Joi.string().required().min(3).max(30),
  email: Joi.string().email().required().lowercase(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,50})"
      )
    )
    .required()
    .min(6)
    .max(50)
    .messages({
      "string.pattern.base":
        "password should be min 6 characters long and max 50 characters long and contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
    }),
  role: Joi.string().required().valid("creator", "seeker"),
});

// todo: ===================================================== validation for login =====================================================

const login_Validator = Joi.object({
  email: Joi.string().email().required().lowercase(),
  password: Joi.string().required(),
});

// todo: ===================================================== validation for adding jobs =====================================================

const users_IDValidator = Joi.object({
  user_id: Joi.string().required(),
});

// todo: ===================================================== validation for updating user profile =====================================================

const updateProfile_Validator = Joi.object({
  user_id: Joi.string().required(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  location: Joi.string(),
  resume: Joi.string(),
  experience: Joi.string(),
});

module.exports = {
  users_Validator,
  login_Validator,
  users_IDValidator,
  updateProfile_Validator,
};
