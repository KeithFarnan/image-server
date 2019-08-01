const mongoose = require('mongoose');
// Pass a javaScript object to the schema method for how the product should look
const eventSchema = mongoose.Schema({
  // _id is convention
  // ObjectId specific and unique
  _id: mongoose.Schema.Types.ObjectId,
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  eventTitle: {
    type: String,
    required: true,
    required: true
  },
  location: String,
  images: [
    {
      image: {
        type: Schema.Types.ObjectId,
        ref: 'image'
      }
    }
  ]
});

// this has a capital letter by convention
module.exports = mongoose.model('Event', eventSchema);
