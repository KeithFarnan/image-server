const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "This is a Json GET request :)"
  });
});

router.post("/", (req, res, next) => {
  // Creating new product as javaScript Object
  // what is expected is stated in the documentation
  const product = {
    name: req.body.name,
    price: req.body.price
  };
  res.status(201).json({
    message: "Handelling POST request to /products",
    createdProduct: product
  });
});

// : sets up the the valuesis a variable
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  if (id === "special") {
    res.status(200).json({
      message: " This is the special URL"
    });
  } else {
    res.status(200).json({
      message: "You passed an id"
    });
  }
});

router.patch("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "Updated Product"
  });
});

router.delete("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "Product deleted"
  });
});

module.exports = router;
