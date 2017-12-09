const mongoose = require('../config/mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: {
      validator: (value) => {
      let emailRegex = /^([\w-.]+@([\w-]+.)+[\w-]{2,4})?$/;
      return emailRegex.test(value);
      },
      message: 'Invalid email address',
    },
    trim: true,
  },
  password: { type: String, required: 'Password is required' },
  firstName: { type: String, required: 'First Name is required' },
  lastName: { type: String, required: 'Last Name is required' },
  tokens: { emailActivateToken: String, refreshToken: String },
  isTestUser: {type: Boolean}
}, {
  timestamps: true
});

userSchema.pre('save', function (next) {
  const user = this;

  if (user.isNew) {
    this.tokens.emailActivateToken = crypto.randomBytes(40).toString('hex');
  }

  (async () => {
    if ((user.isNew && user.password) || user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 10);      
    }
    next();
  })();   
});

module.exports = mongoose.model("User", userSchema);