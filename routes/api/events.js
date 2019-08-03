const express = require('express');
const router = express.Router();
const Event = require('../../models/event');
const mongoose = require('mongoose');
const multer = require('multer');
const auth = require('../../middleware/auth');
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

// @route    event api/events
// @desc     Create a event
// @access   Private
router.post(
  '/',
  auth,
  // make,
  mkdirp,
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
      let event = new Event({
        _id: new mongoose.Types.ObjectId(),
        user: user.userId,
        eventTitle: req.body.eventTitle,
        // images: [
        //   {
        rawImageUrl: req.file.path
        //   }
        // ]
      });
      // const event = await newevent.save();
      res.json(event);
      event.save();
      /* .then(result => {
      res.status(201).json({
        message: 'Created event',
        createdevent: {
          _id: result.id,
          eventTitle: result.eventTitle,
          request: {
            type: 'post',
            url: 'http://localhost:3000/events/' + result._id
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

// @route    GET api/events
// @desc     Get all events
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const events = await event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/events/:id
// @desc     Get event by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/events/:id
// @desc     Delete a event
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'event not found' });
    }

    // Check user
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await event.remove();

    res.json({ msg: 'event removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/events/like/:id
// @desc     Like a event
// @access   Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const event = await event.findById(req.params.id);

    // Check if the event has already been liked
    if (
      event.likes.filter(like => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'event already liked' });
    }

    event.likes.unshift({ user: req.user.id });

    await event.save();

    res.json(event.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/events/unlike/:id
// @desc     Like a event
// @access   Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const event = await event.findById(req.params.id);

    // Check if the event has already been liked
    if (
      event.likes.filter(like => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'event has not yet been liked' });
    }

    // Get remove index
    const removeIndex = event.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    event.likes.splice(removeIndex, 1);

    await event.save();

    res.json(event.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    event api/events/comment/:id
// @desc     Comment on a event
// @access   Private
router.post(
  '/comment/:id',
  [
    auth,
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
      const event = await event.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      event.comments.unshift(newComment);

      await event.save();

      res.json(event.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/events/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const event = await event.findById(req.params.id);

    // Pull out comment
    const comment = event.comments.find(
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
    const removeIndex = event.comments
      .map(comment => comment.id)
      .indexOf(req.params.comment_id);

    event.comments.splice(removeIndex, 1);

    await event.save();

    res.json(event.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
