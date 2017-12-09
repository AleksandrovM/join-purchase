const express = require("express");
const router = require("express").Router();

const {validationHelper} = require('../../helpers'); 
const {passportMiddleware} = require('../authentication/authenticationService');


router
 .use(passportMiddleware.authenticate())
 .get('/', async (req, res, next) => {
  try {    

    // todo - get user fron db with all attr

    let user = {
      id: req.user.id,
      email: req.user.email,
    };

    res.send(user);
  } catch (error) {
    next(error);
  }
});

 
module.exports = router;