const User = require('../../models/user');
const HttpStatus = require('http-status-codes');
const {errorHelper} = require('../../helpers');
const bcrypt = require('bcrypt');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

let service = {};

service.register = (user) => {
  let newUser = new User({
    email: user.email,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName
  });
  return newUser.save();
};

service.login = async (loginModel) => {
  let user = await User.findOne({email: loginModel.email});

  if(!user)
    errorHelper.generateError(HttpStatus.UNAUTHORIZED, 'Invalid email or password. Try again', 'User not found');
    
  const isMatch = await bcrypt.compare(loginModel.password, user.password);

  if(!isMatch)
    errorHelper.generateError(HttpStatus.UNAUTHORIZED, 'Invalid email or password. Try again', 'Incorrect password');

  const exp = user.isTestUser ? config.auth.shortTokenAge : config.auth.tokenAge;
  const currentUser = {
    id: user._id,
    email: user.email,
    roles: []
  };
  const accessToken = jwt.sign(currentUser, config.auth.secret, { expiresIn: exp });
  user.tokens.refreshToken = `${user._id.toString()}.${crypto.randomBytes(40).toString('hex')}`;

  await user.save();

  return {
    accessToken: accessToken,
    refreshToken: user.tokens.refreshToken
  };
};

module.exports = service;