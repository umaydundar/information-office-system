const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  summary: String,
  description: String,
  date: {type: Date},
});


module.exports = mongoose.model('Announcement', announcementSchema);
