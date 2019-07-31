const mongoose = require('mongoose');

require('dotenv').config();

// connect to mongoDB with async command and trycatch block
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_HOST, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB Connected Successfully');
    // if the connection is not made catch the error
  } catch (err) {
    console.error(err.message);
    // Exit process with error
    process.exit(1);
  }
};

module.exports = connectDB;
