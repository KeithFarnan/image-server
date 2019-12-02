const Joi = require('joi');
const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(3)
      .lowercase(),
    email: Joi.string()
      .min(3)
      .required(),
    password: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(user, schema);
}

exports.User = mongoose.model('User', userSchema);
exports.validate = validateUser;
