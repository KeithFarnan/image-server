const express = require("express");
const router = express.Router();
const Image = require("../models/image");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  Image.find()
    .select("name location date _id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            location: doc.location,
            date: doc.date,
            _id: doc._id,
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

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "This is a Json POST request for images"
  });
});

// : sets up the the valuesis a variable
router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  if (id === "special") {
    res.status(200).json({
      message: " This is the special URL"
    });
  } else {
    res.status(200).json({
      message: "You passed an id for an image"
    });
  }
});

router.patch("/:imageId", (req, res, next) => {
  res.status(200).json({
    message: "Images updated"
  });
});

router.delete("/:imageId", (req, res, next) => {
  res.status(200).json({
    message: "iamge deleted"
  });
});

module.exports = router;
