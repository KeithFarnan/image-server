const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, validate } = require('../../models/user');
require('dotenv').config();

// Route to allow users to be created and stored in the db
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error)    return res.status(400).send(error.details[0].message);
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }
    const newUser = new User({
      name,
      email,
      password
    });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();
    const payload = {
      newUser: {
        id: newUser.id
      }
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
