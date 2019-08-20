const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { Event, validate } = require('../../models/event');
const { User } = require('../../models/user');
const { Image } = require('../../models/image');
const { upload } = require('../../multer');

router.post('/', upload.array('pictures'), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send('invalid user');

  try {
    let event = new Event({
      user: {
        _id: user.id,
        name: user.name
      },
      eventTitle: req.body.eventTitle,
      eventDate: req.body.date,
      images: req.files.map(file => ({
        imageTitle: file.filename,
        imageUrl: file.path
      }))
    });
    res.json(event);
    event.save();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
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

router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndRemove(req.params.id);
    if (!event) return res.status(404).send('this event does not exist');
    res.send(event);
    res.json({ msg: 'event removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'event not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.put('/:id', async (req, res) => {
  const { error } = validateevent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const event = await event.findById(req.params.id);
    if (!event) return res.status(400).send('invalid event id');

    event.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
