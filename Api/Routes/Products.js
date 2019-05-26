const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'This is a Json GET request :)'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'This is a Json POST request :)'
    });
});

module.exports = router;