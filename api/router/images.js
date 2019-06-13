const express = require("express");
const router = express.Router();
const Image = require("../models/image");
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");

// GET request for all images
router.get("/", (req, res, next) => {
  Image.find()
    .select("_id date name location")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            _id: doc._id,
            date: doc.date,
            name: doc.name,
            location: doc.location,
            request: {
              type: "GET",
              url: "http://localhost:3000/images/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
// POST request path execute left to rigth so the auth will go befor the rest
router.post("/", (req, res, next) => {
  // Creating new product as javaScript Object
  // what is expected is stated in the documentation
  // Passing JavaScript objec as the parameters for the object
  const image = new Image({
    _id: new mongoose.Types.ObjectId(),
    date: req.body.date,
    name: req.body.name,
    location: req.body.location
  });
  image
    .save()
    .then(result => {
      res.status(201).json({
        message: "Creted images",
        createdImage: {
          _id: result.id,
          date: result.date,
          name: result.name,
          location: result.location,
          request: {
            type: "post",
            url: "http://localhost:3000/images/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// : sets up the the valuesis a variable
router.get("/:imageId", (req, res, next) => {
  const id = req.params.imageId;
  Image.findById(id)
    .select("_id date name location")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/images/" + doc._id
          }
        });
      } else {
        res.status(404).json({
          message: "No image found for this id"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:imageId", (req, res, next) => {
  const id = req.params.imageId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Image.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:imageId", (req, res, next) => {
  const id = req.params.imageId;
  Image.remove({
    _id: id
  })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
