const mongoose = require("mongoose");
// Pass a javaScript object to the schema method for how the product should look
const imageSchema = mongoose.Schema({
  // _id is convention
  //   ObjectId specific and  unique
  _id: mongoose.Schema.Types.ObjectId,
  date: { type: String, required: false },
  name: { type: String, required: true },
  location: String,
  url: { type: String, required: true }
});
// this has a capital letter by convention
module.exports = mongoose.model("Image", imageSchema);
