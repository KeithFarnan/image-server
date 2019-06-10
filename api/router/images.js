const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "This is a Json GET request for images"
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
