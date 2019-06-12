const mongoose = require("mongoose");
// Pass a javaScript object to the schema method for how the product should look
const productSchema = mongoose.Schema({
  // _id is convention
  //   ObjectId specific and  unique
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  location: String,
  date: Date
});
// this has a capital letter by convention
module.exports = mongoose.model("Image", imageSchema);
