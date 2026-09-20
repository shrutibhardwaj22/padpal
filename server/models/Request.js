const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hostelBlock: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  items: {
    type: [String],
    validate: {
      validator: v => v.length > 0,
      message: 'At least one item is required'
    }
  },
  urgency: {
    type: String,
    enum: ['normal', 'emergency'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['open', 'matched', 'completed'],
    default: 'open'
  },
  helpedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fast feed queries
requestSchema.index({ hostelBlock: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Request', requestSchema);