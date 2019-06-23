const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// importing user model
const User = require("../../models/user");

/**
|--------------------------------------------------
| This is a comment section
|--------------------------------------------------
*/
// create new user Creating new user as javaScript Object what is expected is stated in the documentation Passing JavaScript objec as the parameters for the object
router.post("/signup", (req, res, next) => {
  User.find({ name: req.body.name })
    .exec()
    .then(user => {
      // if the user exists throw this error it returns an array check if the array contains anything
      if (user.length >= 1) {
        return res.status(409).json({
          error: "name already exists"
        });
      } else {
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
      }
    });
});

router.post("/login", (req, res, next) => {
  User.find({ name: req.body.name })
    // gets us a promise
    .exec()
    // naming the array whatevey you want checks is the user is less than 1
    .then(user => {
      if (user.length < 1) {
        // 401 is unautorised
        return res.status(401).json({
          // ! TODO This must be changed befor being deployed
          message:
            "Auth failed - no user with this name - (this is just for testing will be deleted before being deployed)"
        });
      }
      // after checking if the user exists check the password matches, because it is an array use user[0] for the first index
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            // ! TODO change this response to a generic one which does not give away why it did not work
            message: "Auth failed - no password was entered"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              id: user[0]._id,
              name: user[0].name
            },
            //Then need a private key for the jwt
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            // * Maybe this should be modified to give a better output
            message: "Auth successful - username and password match",
            token: token
          });
        }
        return res.status(401).json({
          message: "Auth failed - Wrong password entered"
        });
      });
    })
    .catch(err => {
      console.log(err);
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
  User.remove({
    _id: req.params.userId
  })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
module.exports = router;
