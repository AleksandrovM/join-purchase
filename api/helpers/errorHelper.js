const HttpStatus = require('http-status-codes');

let errorHelper = {};

errorHelper.generateError = (status, message, details) => {    
    message = message || HttpStatus.getStatusText(status);
    let err = new Error(message);
    err.status = status;
    err.details = details || '';
    throw err;
};

module.exports = errorHelper;