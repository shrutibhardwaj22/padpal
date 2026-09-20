const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const userResponse = (user, token) => ({
  token,
  user: {
    id: user._id,
    nickname: user.nickname,
    avatar: user.avatar,
    hostelBlock: user.hostelBlock,
    roomNumber: user.roomNumber,
    compassionPoints: user.compassionPoints,
    badges: user.badges,
    role: user.role
  }
});

// Register
router.post('/register', [
  body('nickname').trim().isLength({ min: 2, max: 20 }).withMessage('Nickname must be 2-20 characters'),
  body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
  body('hostelBlock').trim().notEmpty().withMessage('Hostel block is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

    const { nickname, avatar, hostelBlock, roomNumber, password } = req.body;

    const existing = await User.findOne({ hostelBlock, roomNumber });
    if (existing)
      return res.status(400).json({ message: 'This room is already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ nickname, avatar, hostelBlock, roomNumber, password: hashed });
    const token = generateToken(user._id);

    res.status(201).json(userResponse(user, token));
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', [
  body('roomNumber').trim().notEmpty(),
  body('hostelBlock').trim().notEmpty(),
  body('password').notEmpty(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: 'All fields are required' });

    const { hostelBlock, roomNumber, password } = req.body;

    const user = await User.findOne({ hostelBlock, roomNumber });
    if (!user)
      return res.status(400).json({ message: 'Room not found' });

    if (user.role === 'blocked')
      return res.status(403).json({ message: 'Your account has been blocked' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: 'Incorrect password' });

    const token = generateToken(user._id);
    res.json(userResponse(user, token));
  } catch (err) {
    next(err);
  }
});

// Get current user
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;