const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "This is a Json GET request :)"
  });
});

router.post("/", (req, res, next) => {
  // creating orders JSON object
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity
  };
  res.status(201).json({
    message: "Order created",
    order: order
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
      message: "You passed an id"
    });
  }
});

router.patch("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Updated order"
  });
});

router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "order deleted"
  });
});

module.exports = router;
