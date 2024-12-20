const mongoose = require('mongoose');

const guideFeedbackSchema = new mongoose.Schema({
  guideId: mongoose.Schema.Types.ObjectId,
  tourId: mongoose.Schema.Types.ObjectId,
  score: Number,
  feedback: String,
  // Additional fields as necessary
});

module.exports = mongoose.model('GuideFeedback', guideFeedbackSchema);
