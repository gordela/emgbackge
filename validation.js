//Validaiton
const Joi = require("@hapi/joi");
//Register Vaidation
const registerValidation = data => {
  const schema = {
    name: Joi.string()
      .min(6)
      .required(),
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
  };
  return Joi.validate(data, schema);
};

const loginValidation = data => {
  const schema = {
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
  };
  return Joi.validate(data, schema);
};

const projectValidation = data => {
  const schema = {
    title: Joi.string().required(),
    client: Joi.string().required(),
    duration: Joi.number().required(),
    fbLink: Joi.string().required(),
    twLink: Joi.string().required(),
    longDesc: Joi.string().required(),
    shortDesc: Joi.string().required(),
    longImage: Joi.string().required(),
    shortImage: Joi.string().required(),
    categoryId: Joi.string().required()
  };
  return Joi.validate(data, schema);
};

const styleValidation = data => {
  const schema = {
    name: Joi.string().required()
  };
  return Joi.validate(data, schema);
};

const careerValidation = data => {
  const schema = {
    title: Joi.string().required(),
    published: Joi.date(),
    endDate: Joi.date(),
    description: Joi.string().required()
  };
  return Joi.validate(data, schema);
};

const newsValidation = data => {
  const schema = {
    title: Joi.string().required(),
    shortDesc: Joi.string().required(),
    longDesc: Joi.string().required(),
    shortImage: Joi.string().required(),
    longImage: Joi.string().required(),
    fbLink: Joi.string().required(),
    twLink: Joi.string().required()
  };
  return Joi.validate(data, schema);
};

const employeeValidation = data => {
  const schema = {
    picture: Joi.string().required(),
    position: Joi.string().required(),
    fullName: Joi.string().requried(),
    email: Joi.string().required()
  };
  return Joi.validate(data, schema);
};

const branchValidation = data => {
  const schema = {
    text_one: Joi.string().required(),
    text_two: Joi.string().required()
  };
  return Joi.validate(data, schema);
};

const categoryValidation = data => {
  const schema = {
    name: Joi.string().required(),
    image: Joi.string().required()
  };
  return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.employeeValidation = employeeValidation;
module.exports.loginValidation = loginValidation;
module.exports.projectValidation = projectValidation;
module.exports.styleValidation = styleValidation;
module.exports.branchValidation = branchValidation;
module.exports.careerValidation = careerValidation;
module.exports.newsValidation = newsValidation;
module.exports.categoryValidation = categoryValidation;
