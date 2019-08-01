const mongoose = require('mongoose');
// Pass a javaScript object to the schema method for how the product should look
const imageSchema = mongoose.Schema({
  // _id is convention
  // ObjectId specific and unique
  _id: mongoose.Schema.Types.ObjectId,
  imageTitle: String,
  rawImageUrl: {
    type: String,
    required: true
  }
  // jpegUrl: {
  //   type: String
  // },
  // webPUrl: {
  //   type: String
  // }
});

// this has a capital letter by convention
module.exports = mongoose.model('Image', imageSchema);
