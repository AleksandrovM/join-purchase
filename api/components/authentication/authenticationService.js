const User = require('../../models/user');
const HttpStatus = require('http-status-codes');
const {errorHelper} = require('../../helpers');
const bcrypt = require('bcrypt');
const config = require('../../config/config');
const jwt = require('jwt-simple');
const crypto = require('crypto');
const passport = require('passport');
const {Strategy, ExtractJwt} = require('passport-jwt');

const passportStratagyParams = {
  secretOrKey: config.auth.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer')
};

const customPassportStratagy = 
  new Strategy(passportStratagyParams, async (payload, done) => {
    let user = await User.findOne({_id: payload.id});

    if(!user)
    {
      return done(null, false);   
    } else {             
      if(new Date() <= new Date(payload.token_expiration_date))
      {
        return done(null, {
          id: user.id,
          email: user.email,          
          roles: []
        });
      }
      else{
        return done(null, false);   
      }
  
    }
});

passport.use(customPassportStratagy);

let service = {};

service.passportMiddleware = {
  initialize: () => {
    return passport.initialize();
  },
  authenticate: () => {
    return passport.authenticate("jwt", config.auth.jwtSession);
  }
};

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

  //const exp = user.isTestUser ? config.auth.shortTokenAge : config.auth.tokenAge;

  var n = new Date ();
  n.setMinutes(n.getMinutes() + 10);

  const payload = {
    id: user._id,
    email: user.email,
    salt: crypto.randomBytes(10).toString('hex'),
    token_expiration_date: n,
    roles: []
  };
  const accessToken = jwt.encode(payload, config.auth.jwtSecret);
  user.tokens.refreshToken = `${user._id.toString()}.${crypto.randomBytes(40).toString('hex')}`;

  await user.save();

  return {
    accessToken: accessToken,
    refreshToken: user.tokens.refreshToken
  };
};

module.exports = service;