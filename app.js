const express = require("express");

// executes express like a function allowing us to use methods
const app = express();

// creating the const values which referenc the API routes file locations for each element
const productRoutes = require("./api/router/products");
const orderRoutes = require("./api/router/orders");
const imageRoutes = require("./api/router/images");

// all urls with /images will use imageRoutes files
// this way allows us to split up the code into seperate files
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/images", imageRoutes);

module.exports = app;
