const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// importing user model
const User = require("../models/user");

// create new user
// Creating new user as javaScript Object
// what is expected is stated in the documentation
// Passing JavaScript objec as the parameters for the object
router.post("/signup", (req, res, next) => {
  // hash the password 10 times - either get error or hash
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: "did not hash the password"
      });
    } else {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        password: hash
      });
      user
        .save()
        .then(result => {
          res.status(201).json({
            message: "Creted user",
            createdUser: {
              id: result.id,
              name: result.name,
              password: result.password
            }
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: "Did not create the user"
          });
        });
    }
  });
});

router.get("/", (req, res, next) => {
  User.find()
    .select("_id name password")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            password: doc.password,
            request: {
              type: "GET",
              url: "http://localhost:3000/users/" + doc._id
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

// : sets up the the valuesis a variable
router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .select("_id name password")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          user: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/users/" + doc._id
          }
        });
      } else {
        res.status(404).json({
          message: "No User found for this id"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/:userId", (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  User.update({ _id: id }, { $set: updateOps })
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

router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.remove({
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
