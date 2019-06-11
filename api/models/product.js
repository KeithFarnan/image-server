const mongoose = require("mongoose");

// Pass a javaScript object to the schema method for how the product should look
const productSchema = mongoose.Schema({
  //_ is convention
  //   ObjectId specific and  unique
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number
});

module.exports = mongoose.model("Product", productSchema);
