const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const { imageSchema } = require('./image');

const Event = mongoose.model(
  'Event',
  new mongoose.Schema({
    eventTitle: {
      type: String,
      // required: true,
      minlength: 3,
      maxlength: 20,
      lowercase: true,
      trim: true
    },
    user: {
      type: new mongoose.Schema({
        name: {
          type: String,
          // required: true,
          minlength: 5,
          maxlength: 50,
          trim: true,
          lowercase: true
        }
      })
      // required: true
    },
    eventDate: {
      type: Date,
      default: Date.now
      // required: true
    },
    images: [
      {
        imageTitle: {
          type: String
          // required: true
        },
        imageUrl: {
          type: String
          // required: true
        }
        // people: {
        //   type: new mongoose.Schema({
        //     names: [String]
        //   })
        // }
      }
    ]
  })
);

function validateEvent(event) {
  const schema = {
    eventTitle: Joi.string(),
    // .min(3)
    // .max(20),
    // .required()
    userId: Joi.ObjectId(),
    // .required(),
    imageTitle: Joi.string(),
    imageUrl: Joi.string(),
    eventDate: Joi.date()
  };
  return Joi.validate(event, schema);
}

exports.Event = Event;
exports.validate = validateEvent;
