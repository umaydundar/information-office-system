const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  surname: String,
  email: String,
  password: String,
  phone: String,
  totalTours: { type: Number, default: 0 },
  userType: String,
  score: { type: Number, default: 0 },
  rank: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  weeklySchedule: {
    type: [[Number]],
    default: function () {
      return Array(5).fill().map(() => Array(8).fill(0));
    },
  },
});

module.exports = mongoose.model('User', userSchema);
