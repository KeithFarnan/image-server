const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const { imageSchema } = require('./image');

const ImageFolder = mongoose.model(
  'ImageFolder',
  new mongoose.Schema({
    userId: {
      type: new mongoose.Schema({
        name: {
          type: String,
          minlength: 5,
          maxlength: 50,
          trim: true,
          lowercase: true
        }
      })
    },
    imageFolderTitle: {
      type: String,
      minlength: 3,
      maxlength: 20,
      lowercase: true,
      trim: true,
      required: true
    },
    imageFolderDate: {
      type: Date,
      default: Date.now
    },
    images: [
      {
        imageTitle: {
          type: String
        },
        imageUrl: {
          type: String
        }
      }
    ]
  })
);

function validateimageFolder(imageFolder) {
  const schema = {
    userId: Joi.ObjectId(),
    imageFolderTitle: Joi.string()
    .min(3)
    .max(20)
    .required(),
    imageFolderDate: Joi.date(),
    // images: joi.array(){
    //   imageTitle: Joi.string(),
    //   imageUrl: Joi.string()
    // },
  };
  return Joi.validate(imageFolder, schema);
}

exports.ImageFolder = ImageFolder;
exports.validate = validateimageFolder;
