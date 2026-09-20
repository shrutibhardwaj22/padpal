const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Request = require('../models/Request');
const User = require('../models/User');
const auth = require('../middleware/auth');

const POINTS = { normal: 10, emergency: 15 };
const BADGE_THRESHOLDS = [
  { points: 10, badge: '🩸 Period Pal' },
  { points: 30, badge: '⚡ Fast Responder' },
  { points: 60, badge: '🏆 Care Champion' },
];

const updateBadges = async (userId, points) => {
  const earned = BADGE_THRESHOLDS.filter(b => points >= b.points).map(b => b.badge);
  await User.findByIdAndUpdate(userId, { badges: earned });
};

// Get feed — open requests in same block (paginated)
router.get('/', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const requests = await Request.find({
      hostelBlock: user.hostelBlock,
      status: 'open'
    })
      .sort({ urgency: -1, createdAt: -1 }) // emergency first
      .skip(skip)
      .limit(limit);

    const total = await Request.countDocuments({ hostelBlock: user.hostelBlock, status: 'open' });

    res.json({ requests, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// Get my requests
router.get('/mine', auth, async (req, res, next) => {
  try {
    const requests = await Request.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(requests);
  } catch (err) {
    next(err);
  }
});

// Post new request
router.post('/', auth, [
  body('items').isArray({ min: 1 }).withMessage('Select at least one item'),
  body('urgency').isIn(['normal', 'emergency']).withMessage('Invalid urgency'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

    const user = await User.findById(req.user.id);
    if (user.role === 'blocked')
      return res.status(403).json({ message: 'Your account has been blocked' });

    const existing = await Request.findOne({ postedBy: req.user.id, status: 'open' });
    if (existing)
      return res.status(400).json({ message: 'You already have an open request' });

    const { items, urgency } = req.body;
    const request = await Request.create({
      postedBy: req.user.id,
      hostelBlock: user.hostelBlock,
      roomNumber: user.roomNumber,
      items,
      urgency
    });

    // Emit to block
    const io = req.app.get('io');
    io.to(user.hostelBlock).emit('new-request', request);

    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
});

// Offer to help
router.patch('/:id/help', auth, async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request)
      return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'open')
      return res.status(400).json({ message: 'Request is no longer available' });
    if (request.postedBy.toString() === req.user.id)
      return res.status(400).json({ message: 'You cannot help your own request' });

    const helper = await User.findById(req.user.id);
    if (helper.role === 'blocked')
      return res.status(403).json({ message: 'Your account has been blocked' });

    request.status = 'matched';
    request.helpedBy = req.user.id;
    await request.save();

    const io = req.app.get('io');
    io.to(request.hostelBlock).emit('request-updated', request);

    res.json(request);
  } catch (err) {
    next(err);
  }
});

// Mark as received + rate
router.patch('/:id/received', auth, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

    const request = await Request.findById(req.params.id);

    if (!request)
      return res.status(404).json({ message: 'Request not found' });
    if (request.postedBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Only the requester can mark as received' });
    if (request.status !== 'matched')
      return res.status(400).json({ message: 'Request is not in matched state' });

    const { rating } = req.body;
    request.status = 'completed';
    request.rating = rating || null;
    await request.save();

    // Award points + update badges
    const points = POINTS[request.urgency] || 10;
    const helper = await User.findByIdAndUpdate(
      request.helpedBy,
      { $inc: { compassionPoints: points } },
      { new: true }
    );
    await updateBadges(request.helpedBy, helper.compassionPoints);

    const io = req.app.get('io');
    io.to(request.hostelBlock).emit('request-updated', request);

    res.json({ message: 'Marked as received', request });
  } catch (err) {
    next(err);
  }
});

module.exports = router;