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
    // people: {
    //   type: new mongoose.Schema({
    //     names: [String]
    //   })
    // }
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
    // password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    // access_token: [Joi.string(), Joi.number()],
    // birthyear: Joi.number().integer().min(1900).max(2013),
    // email: Joi.string().email({ minDomainAtoms: 2 })
    // })
    // .with('username', 'birthyear').without('password', 'access_token');
  });
  return Joi.validate(image, schema);
}

exports.Image = Image;
exports.validate = validateImage;
