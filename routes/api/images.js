const express = require('express');
const router = express.Router();
const Image = require('../../models/image');
const mongoose = require('mongoose');
const multer = require('multer');
const { check, validationResult } = require('express-validator/check');
const mkdirp = require('mkdirp');
const fs = require('fs');
const User = require('../../models/user');

// more detailed way of storing files not just destination
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(
      null,
      // __dirname +
      'uploads/'
      // + file.originalname
    );
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname + '-' + Date.now());
  }
});
// types of files to upload
const filefilter = (req, file, cb) => {
  //reject a file == false save == true
  // true saves the file, false does not
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
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

// const make =
mkdirp('uploads/user.name/the/fore', function(err) {
  if (err) console.error(err);
  console.log('created the file');
});

// Async/Await:
async function copyFiles() {
  try {
    await fs.copy('/tmp/myfile', '/tmp/mynewfile');
    console.log('success!');
  } catch (err) {
    console.error(err);
  }
}

// @route    image api/images
// @desc     Create a image
// @access   Private
router.post(
  '/',
  //
  // make,
  // mkdirp,
  upload.single('picture'),
  async (req, res, next) => {
    // console.log(req.file);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send('invalid user');

    try {
      let image = new Image({
        _id: new mongoose.Types.ObjectId(),
        user: user.userId,
        imageTitle: req.body.imageTitle,
        // images: [
        //   {
        rawImageUrl: req.file.path
        //   }
        // ]
      });
      // const image = await newimage.save();
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
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/images
// @desc     Get all images
// @access   Private
router.get('/', async (req, res) => {
  try {
    const images = await image.find().sort({ date: -1 });
    res.json(images);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/images/:id
// @desc     Get image by ID
// @access   Private
router.get('/:id', async (req, res) => {
  try {
    const image = await image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ msg: 'image not found' });
    }

    res.json(image);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'image not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/images/:id
// @desc     Delete a image
// @access   Private
router.delete('/:id', async (req, res) => {
  try {
    const image = await image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ msg: 'image not found' });
    }

    // Check user
    if (image.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await image.remove();

    res.json({ msg: 'image removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'image not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/images/like/:id
// @desc     Like a image
// @access   Private
router.put('/like/:id', async (req, res) => {
  try {
    const image = await image.findById(req.params.id);

    // Check if the image has already been liked
    if (
      image.likes.filter(like => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'image already liked' });
    }

    image.likes.unshift({ user: req.user.id });

    await image.save();

    res.json(image.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/images/unlike/:id
// @desc     Like a image
// @access   Private
router.put('/unlike/:id', async (req, res) => {
  try {
    const image = await image.findById(req.params.id);

    // Check if the image has already been liked
    if (
      image.likes.filter(like => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'image has not yet been liked' });
    }

    // Get remove index
    const removeIndex = image.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    image.likes.splice(removeIndex, 1);

    await image.save();

    res.json(image.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    image api/images/comment/:id
// @desc     Comment on a image
// @access   Private
router.post(
  '/comment/:id',
  [
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const image = await image.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      image.comments.unshift(newComment);

      await image.save();

      res.json(image.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/images/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', async (req, res) => {
  try {
    const image = await image.findById(req.params.id);

    // Pull out comment
    const comment = image.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Get remove index
    const removeIndex = image.comments
      .map(comment => comment.id)
      .indexOf(req.params.comment_id);

    image.comments.splice(removeIndex, 1);

    await image.save();

    res.json(image.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
