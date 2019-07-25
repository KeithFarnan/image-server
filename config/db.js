const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

// connect to mongoDB with async command and trycatch block
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB Connected...');
    // if the connection is not made catch the error
  } catch (err) {
    console.error(err.message);
    // Exit process with error
    process.exit(1);
  }
};

module.exports = connectDB;
