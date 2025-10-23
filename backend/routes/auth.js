const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

//  Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, fullName, email } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ msg: 'Email already registered' });
    }
    exists = await User.findOne({ where: { username } });
    if (exists) {
      return res.status(400).json({ msg: 'Username already taken' });
    }
    // Hash password
    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hash,
      fullName,
      email,
      role: 'student'  // mặc định student
    });

    return res.status(201).json({
      msg: 'User registered successfully',
      user: { userId: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

//  Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid username or password' });
    }

    // Kiểm tra password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ msg: 'Invalid username or password' });
    }

    // Tạo JWT
    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: { userId: user.userId, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
