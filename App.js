const express = require('express');

// executes express like a function allowing us to use methods
const app = express();

const productRoutes = require('./Api/Routes/Products');


// all urls with /products will use productRoutes files
// this way allows us to split up the code into files
app.use('/products', productRoutes);

module.exports = app;