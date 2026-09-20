const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Request = require('../models/Request');

const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin')
      return res.status(403).json({ message: 'Admins only' });
    next();
  } catch (err) {
    next(err);
  }
};

// Stats
router.get('/stats', auth, adminOnly, async (req, res, next) => {
  try {
    const [totalRequests, completed, open, totalUsers] = await Promise.all([
      Request.countDocuments(),
      Request.countDocuments({ status: 'completed' }),
      Request.countDocuments({ status: 'open' }),
      User.countDocuments({ role: 'user' }),
    ]);
    res.json({ totalRequests, completed, open, totalUsers });
  } catch (err) {
    next(err);
  }
});

// All users
router.get('/users', auth, adminOnly, async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ compassionPoints: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// All requests
router.get('/requests', auth, adminOnly, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const requests = await Request.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Request.countDocuments();
    res.json({ requests, total, page });
  } catch (err) {
    next(err);
  }
});

// Block user
router.patch('/users/:id/block', auth, adminOnly, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { role: 'blocked' });
    res.json({ message: 'User blocked successfully' });
  } catch (err) {
    next(err);
  }
});

// Unblock user
router.patch('/users/:id/unblock', auth, adminOnly, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { role: 'user' });
    res.json({ message: 'User unblocked successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;