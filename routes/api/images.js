const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Image = require("../../models/image");
const multer = require("multer");
const { check, validationResult } = require("express-validator");
const User = require("../../models/user");

// more detailed way of storing files not just destination
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(
      null,
      // __dirname +
      "uploads/"
      // + file.originalname
    );
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname + "-" + Date.now());
  }
});
// types of files to upload
const filefilter = (req, file, cb) => {
  //reject a file == false save == true
  // true saves the file, false does not
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// defining where and how the files are stored
const upload = multer({
  // this uses the storage config we have set above
  storage: storage,
  limits: {
    // limiting filesize to 8mb
    fileSize: 1024 * 1024 * 8
  },
  // uses the file filter set above
  fileFilter: filefilter
});

/* // const make =
mkdirp("uploads/user.name/the/fore", function(err) {
  if (err) console.error(err);
  console.log("created the file");
});

// Async/Await:
async function copyFiles() {
  try {
    await fs.copy("/tmp/myfile", "/tmp/mynewfile");
    console.log("success!");
  } catch (err) {
    console.error(err);
  }
} */

// @route    image api/images
// @desc     Create a image
// @access   Private
router.post(
  "/",
  // upload.single("picture"),
  async (req, res) => {
    const { error } = validateImage(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // const user = await User.findById(req.body.userId);
    // if (!user) return res.status(400).send("invalid user");

    try {
      let image = new Image({
        // user: user.userId,
        imageTitle: req.body.imageTitle,
        rawImageUrl: req.file.path
      });
      res.json(image);
      image.save();
      /* .then(result => {
      res.status(201).json({
        message: 'Created image',
        createdimage: {
          _id: result.id,
          imageTitle: result.imageTitle,
          request: {
            type: 'post',
            url: 'http://localhost:3000/images/' + result._id
          }
        }
      });
    }); */
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/images
// @desc     Get all images
// @access   Private
router.get("/", async (req, res) => {
  const { error } = validateImage(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const images = await Image.find().sort({ date: -1 });
    res.json(images);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/images/:id
// @desc     Get image by ID
// @access   Private
router.get("/:id", async (req, res) => {
  const { error } = validateImage(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const image = await image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ msg: "image not found" });
    }

    res.json(image);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "image not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/images/:id
// @desc     Delete a image
// @access   Private
router.delete("/:id", async (req, res) => {
  try {
    const person = await Person.findByIdAndRemove(req.params.id);
    if (!person) return res.status(404).send("this person does not exist");
    res.send(person);
    res.json({ msg: "image removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "image not found" });
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
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(400).send("invalid image id");
    image.save();
    res.json(image.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

function validateImage(image) {
  const schema = Joi.object().keys({
    userId: Joi.string(),
    imageTitle: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    rawImageUrl: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
    // password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    // access_token: [Joi.string(), Joi.number()],
    // birthyear: Joi.number().integer().min(1900).max(2013),
    // email: Joi.string().email({ minDomainAtoms: 2 })
    // })
    // .with('username', 'birthyear').without('password', 'access_token');
  });
  return Joi.validate(image, schema);
}

module.exports = router;
