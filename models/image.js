const Joi = require('joi');
const mongoose = require('mongoose');

const Image = mongoose.model(
  'Image',
  new mongoose.Schema({
    imageTitle: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String
    }
  })
);

function validateImage(image) {
  const schema = Joi.object().keys({
    imageTitle: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    imageUrl: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
  });
  return Joi.validate(image, schema);
}

exports.Image = Image;
exports.validate = validateImage;
