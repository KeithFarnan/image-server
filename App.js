const express = require('express');

// executes express like a function allowing us to use methods
const app = express();

const productRoutes = require('./Api/Routes/Products');
const orderRoutes = require('./Api/Routes/Orders');


// all urls with /products will use productRoutes files
// this way allows us to split up the code into files
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

module.exports = app;