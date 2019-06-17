const express = require("express");
// executes express like a function allowing us to use methods
const app = express();
// all requests are funnelled through this middleware which logs the data and then lets it continue
// morgan behind the scenes will use the next fuction saying "i logged it now you do something"
const morgan = require("morgan");
// importing the body parser method
const bodyParser = require("body-parser");
// Importing mongoose to create connection to the db
const mongoose = require("mongoose");

// creating connection to the db
mongoose.connect(process.env.MONGO_SERVER);
// , { useNewUrlParser: true });
// This removes the deprecation warning on the console
mongoose.Promise = global.Promise;

// creating the const values which referenc the API routes file locations for each element
const productRoutes = require("./api/router/products");
const orderRoutes = require("./api/router/orders");
const imageRoutes = require("./api/router/images");
const userRoutes = require("./api/router/users");

// prompting the server to log the data befor it is passed to the routes
app.use(morgan("dev"));

/*
Passing url encoded bodys
extended false means only simple bodys will be parsed 
*/
app.use(bodyParser.urlencoded({ extended: false }));

// This will extract JSON data in an easily readable format
// This is added as a method but without parameters
app.use(bodyParser.json());

// This prevents CORS errors from happening
// CORS errors are a security feature for browsers preventing
// other ports from connection to the server
// This setup gives access to everyone with the * for the origin
// this appends the headers to any response we get
// funnels every request thourugh this appending the headers to it
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With, Accept"
  );
  // browser sends options with post or put first
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
    // sends the response with all the headers attached
    return res.status(200).json({});
  }
  // Calling the next method because this did not handle the request and passes it along to the other methods
  next();
});

// all urls with /images will use imageRoutes files
// this way allows us to split up the code into seperate files
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/images", imageRoutes);
app.use("/users", userRoutes);

// all requests that are not any of the above are handelled below
app.use((req, res, next) => {
  //  new const of Error object with the text "Not Found"
  const error = new Error("Not Found");
  // setting the status code property
  error.status = 404;
  // Executes the next method fowarding the error object
  next(error);
});

/*
This method will handle all kinds of errors
including database errors
New First arguement 'error' 
*/
app.use((error, req, res, next) => {
  /*
  use specific error status else use 500 for generic 
  server error as response object 
  */
  res.status(error.status || 500);
  // return JSON object
  res.json({
    // Error object which contains message property
    // to which the error message which we passed in as first arguement
    error: {
      message: error.message
    }
  });
});

module.exports = app;
