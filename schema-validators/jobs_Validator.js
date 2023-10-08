const Joi = require("joi");

// todo: ===================================================== validation for adding jobs =====================================================

const jobs_Validator = Joi.object({
  user_id: Joi.string().required(),
  job_title: Joi.string().required(),
  job_type: Joi.string().required(),
  job_category: Joi.string().required(),
  job_location: Joi.string().required(),
  job_salary: Joi.number().required(),
  job_experience: Joi.number().required(),
  job_company_email: Joi.string().required(),
  job_company_name: Joi.string().required(),
  job_description: Joi.string().required(),
});

module.exports = { jobs_Validator };
