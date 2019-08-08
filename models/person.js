const Joi = require('joi');
const mongoose = require('mongoose');
const Person = mongoose.model(
  'Person',
  new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      lowercase: true
    }
  })
);

function validatePerson(person) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(20)
      .required()
  };
  return Joi.validate(person, schema);
}

exports.Person = Person;
exports.validate = validatePerson;
