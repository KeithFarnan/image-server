const express = require("express");

// executes express like a function allowing us to use methods
const app = express();

// creating the const values which referenc the API routes file locations for each element
const productRoutes = require("./api/router/products");
const orderRoutes = require("./api/router/orders");
const imageRoutes = require("./api/router/images");

// all requests are funnelled through this middleware which logs the data and then lets it continue
// morgan behind the scenes will use the next fuction saying "i logged it now you do something"
const morgan = require("morgan");

app.use(morgan("dev"));

// all urls with /images will use imageRoutes files
// this way allows us to split up the code into seperate files
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/images", imageRoutes);

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
