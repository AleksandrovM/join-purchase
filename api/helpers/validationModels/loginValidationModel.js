const Joi = require('joi');
const validationHelper = require('../validationHelper');

module.exports = {
    email: validationHelper.rules.email,
    password: validationHelper.rules.passwordSimple
};