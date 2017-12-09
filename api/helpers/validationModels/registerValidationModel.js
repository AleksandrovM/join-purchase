const Joi = require('joi');
const validationHelper = require('../validationHelper');

module.exports = {
    email: validationHelper.rules.email,
    password: validationHelper.rules.password,
    firstName: validationHelper.rules.username,
    lastName: validationHelper.rules.username,    
};