const mongoose = require('mongoose');
// Pass a javaScript object to the schema method for how the product should look
const imageSchema = mongoose.Schema({
  // _id is convention
  // ObjectId specific and unique
  _id: mongoose.Schema.Types.ObjectId,
  // date: {
  //   type: Date,
  //   default: Date.now
  //   // required: true
  // },
  imageTitle: {
    type: String,
    required: true
  },
  // location: String,
  // images: [
  //   {
  rawImageUrl: {
    type: String
    // required: true
  }
  //   }
  // ]
  /* images: [
    {
      image: {
        type: Schema.Types.ObjectId,
        ref: 'image'
        imageTitle: String,
  rawImageUrl: {
    type: String
    // required: true
  },
  jpegUrl: {
    type: String
  }
  // webPUrl: {
  //   type: String
  // }
      }
    }
  ] */
});

// this has a capital letter by convention
module.exports = mongoose.model('Image', imageSchema);
