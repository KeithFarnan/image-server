const mongoose = require('mongoose');
require('dotenv').config();

// db connection async function what try catch block if the connection is not made catch the error and exit 
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_HOST, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
