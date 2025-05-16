const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send('All fields are required.');
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already registered.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User registered successfully.');
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).send('Failed to register user.');
  }
});

module.exports = router;
