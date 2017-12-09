const Joi = require('joi');
const errorHelper = require('./errorHelper');
const HttpStatus = require('http-status-codes');

let validationHelper = {};

validationHelper.rules = {
    username: Joi.string().required(),
    email: Joi.string().email().required(),/*.options({
        language: {
            any: {
                allowOnly: 'must be valid email address'
            }
        }
    }),*/
    password: Joi.string().min(8).required(),/*.options({
        language: {
            any: {
                allowOnly: 'must contain at least 8 symbols'
            }
        }
    }),*/
    passwordSimple: Joi.string().required()
};

validationHelper.validate = (model, validationModel) => {
    const result = Joi.validate(model, validationModel);

    if(result.error){
        const firstError = result.error.details[0];
        errorHelper.generateError(HttpStatus.BAD_REQUEST, firstError.message, firstError);
    }
};

module.exports = validationHelper;