const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Person = require("../../models/person");
const { check, validationResult } = require("express-validator");
// @route    image api/images
// @desc     Create a image
// @access   Private
router.post("/", async (req, res, next) => {
  const { error } = validatePerson(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //   try {
  // let personInDB = await Person.findOne(req.body.name);
  // consolse.log(personInDB.name);
  //   if (person) return res.status(400).send("person already exists");
  // if (!personInDB) {
  //   return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
  // }

  let person = new Person({ name: req.body.name });
  //   person = await person.save();
  //   console.log(person);
  //   res.send(person);
  res.json(person);
  person.save();
  //   } catch (err) {
  //     console.error(err.message);
  //     res.status(500).send("Server Error - Fuck me");
  //   }
});

// @route    GET api/images
// @desc     Get all images
// @access   Private
router.get("/", async (req, res) => {
  const { error } = validatePerson(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const people = await Person.find().sort("name");
    res.send(people);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error - lol");
  }
});

// @route    GET api/images/:id
// @desc     Get image by ID
// @access   Private
router.get("/:id", async (req, res) => {
  const { error } = validatePerson(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const person = await Person.findById(req.params.id);

    if (!person) {
      return res.status(404).json({ msg: "person not found" });
    }

    res.json(person);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "person not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/images/like/:id
// @desc     Like a image
// @access   Private
router.put("/:id", async (req, res) => {
  const { error } = validatePerson(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const person = await Person.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      // new to true gives us the updated object in the returned call
      { new: true }
    );

    if (!person) {
      return res.status(404).json({ msg: "person not found" });
    }

    res.json(person);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "person not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/images/:id
// @desc     Delete a image
// @access   Private
router.delete("/:id", async (req, res) => {
  const person = await Person.findByIdAndRemove(req.params.id);
  if (!person) return res.status(404).send("this person does not exist");
  res.send(person);
});

function validatePerson(person) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(person, schema);
}

module.exports = router;
