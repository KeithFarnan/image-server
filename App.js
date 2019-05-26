const express = require('express');

// executes express like a function allowing us to use methods
const app = express();


app.use((req, res, next) => {
    res.status(200).json({
        message: 'This is a Json response :)'
    });
});

module.exports = app;