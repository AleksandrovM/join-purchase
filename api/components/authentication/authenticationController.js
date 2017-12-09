const express = require("express");
const router = require("express").Router();
const service = require("./authenticationService");
const {LoginValidationModel, RegisterValidationModel} = require('../../helpers/validationModels');
const {validationHelper} = require('../../helpers'); 

router.post('/register', async (req, res, next) => {
  try {
    validationHelper.validate(req.body, RegisterValidationModel);
    let newUser = await service.register(req.body);
    res.send(newUser);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    validationHelper.validate(req.body, LoginValidationModel);
    let loginInfo = await service.login(req.body);
    res.send(loginInfo);
  } catch (error) {
    next(error);
  }
});

/*
router.get('/login', function(req, res, next) {
  res.send('Hello world!!!');
});

router.post('/login', function(req, res, next) {
  if (!req.body || !req.body.email || !req.body.password)
  {
    res.status(400).send({error: "Email and password are required."});
    return;
  }
  
  let loginData = req.body;
  res.send(loginData);
});

router.get('/test', async (req, res, next) =>
{
  try {
    // Do something async using await e.g. let d = await getDataFromDB();
    res.json({
      test: 'test test test',
      testN: 123132 
    });
  } catch (e) {
    next(e);
  }
});
*/

module.exports = router;