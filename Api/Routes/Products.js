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

// : sets up the the valuesis a variable
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(201).json({
            message: ' This is the special URL'
        });
    } else {
        res.status(200).json({
            message: 'You passed an id'
        })
    }
});

router.patch('/:productId', (req, res, next) => {
        res.status(200).json({
            message: 'Updated Product'
        });
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Product deleted'
    });
});


module.exports = router;