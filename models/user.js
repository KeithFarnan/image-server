const mongoose = require('mongoose');
// Pass a javaScript object to the schema method for how the product should look
const userSchema = mongoose.Schema({
  // _id is convention
  //   ObjectId specific and  unique
  name: {
    type: String,
    required: true
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
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// this has a capital letter by convention
module.exports = mongoose.model('User', userSchema);
