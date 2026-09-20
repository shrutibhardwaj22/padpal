const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, 'Nickname is required'],
    trim: true,
    minlength: [2, 'Nickname too short'],
    maxlength: [20, 'Nickname too long']
  },
  avatar: {
    type: String,
    default: '🌸'
  },
  hostelBlock: {
    type: String,
    required: [true, 'Hostel block is required'],
    trim: true
  },
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'blocked'],
    default: 'user'
  },
  compassionPoints: {
    type: Number,
    default: 0
  },
  badges: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index — one account per room
userSchema.index({ hostelBlock: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);