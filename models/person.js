const mongoose = require("mongoose");
const personSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    // minlength: 3,
    // maxlength: 20,
    lowercase: true
  }
});

module.exports = mongoose.model("Person", personSchema);
