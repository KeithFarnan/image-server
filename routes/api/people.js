const express = require('express');
const router = express.Router();
const { Person, validate } = require('../../models/person');

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const personExists = Person.findOne(req.body.name);
    if (personExists) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Person already exists' }] });
    }
    let person = new Person({ name: req.body.name });
    res.json(person);
    person.save();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/', async (req, res) => {
  try {
    const people = await Person.find().sort('name');
    res.send(people);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const person = await Person.findById(req.params.id);

    if (!person) {
      return res.status(404).json({ msg: 'person not found' });
    }

    res.json(person);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'person not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const person = await Person.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      // new to true gives us the updated object in the returned call
      { new: true }
    );
    if (!person) {
      return res.status(404).json({ msg: 'person not found' });
    }
    res.json(person);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'person not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  const person = await Person.findByIdAndRemove(req.params.id);
  if (!person) return res.status(404).send('this person does not exist');
  res.send(person);
});

module.exports = router;
