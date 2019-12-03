const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { ImageFolder, validate } = require('../../models/imageFolder');
const { User } = require('../../models/user');
// const { Image } = require('../../models/image');
// const { upload } = require('../../multer');
//! added for multer
const multer = require('multer');
const mkdirp = require('mkdirp');

//! multer
// more detailed way of storing files not just destination
const storage = multer.diskStorage({
  destination: async function(req, file, callback) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send('invalid user');

    const imageFolderTitle = await req.body.imageFolderTitle;
    if (!imageFolderTitle) return res.status(400).send('invalid image Folder Title');

    const dir = `uploads/${user.name}/${imageFolderTitle}`;

    mkdirp(dir, err => {
      if (err) console.error(err);
      else callback(null, dir);
    });
  },
  filename: async function(req, file, callback) {
    callback(
      null,
      // new Date().toISOString() +
      req.body.imageFolderDate + '-' + file.originalname
      // req.body.imageFolderTitle.filename +
      // '.' +
      // file.originalname.split('.').pop()
    );
  }
});
// limits filetypes to be stored in db
const filefilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// defining where and how the files are stored
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 8
  },
  fileFilter: filefilter
});

router.post('/', upload.array('images'), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send('invalid user');
  try {
    let imageFolder = new ImageFolder({
      userId: {
        _id: user.id,
        name: user.name
      },
      imageFolderTitle: req.body.imageFolderTitle,
      imageFolderDate: req.body.date,
      images: req.files.map(file => ({
        imageTitle: file.filename,
        imageUrl: file.path
      }))
    });
    imageFolder.save();
    res.json(imageFolder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get all folders
router.get('/', async (req, res) => {
  try {
    const imageFolders = await ImageFolder.find();
    res.json(imageFolders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get single folder
router.get('/:id', async (req, res) => {
  try {
    const imageFolder = await ImageFolder.findById(req.params.id);
    if (!imageFolder) {
      return res.status(404).json({ msg: 'Not found' });
    }
    res.json(imageFolder);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Folder not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const imageFolder = await ImageFolder.findByIdAndRemove(req.params.id);
    if (!imageFolder) return res.status(404).send('Folder Does Not Exist');
    res.send(imageFolder);
    res.json({ msg: 'Folder Removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Folder Not Found' });
    }
    res.status(500).send('Server Error');
  }
});

router.put('/:id', async (req, res) => {
  const { error } = validateimageFolder(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const imageFolder = await ImageFolder.findById(req.params.id);
    if (!imageFolder) return res.status(400).send('Invalid Folder ID');

    imageFolder.save();
    res.json(imageFolder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
