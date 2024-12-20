const mongoose = require('mongoose');

const fairSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  hour: {
    type: String,
    enum: ['09:00-11:00', '11:00-13:30' ,'13:30-16:00', '16:00-18:00'],
  },
  attainedGuide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // This references the User model
  },
  groupSupervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroupSupervisor',  // This references the new GroupSupervisor model
    required: true,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved' , 'assigned' ,'completed', 'canceled','rejected'],
    default: 'pending',
  },
  email: {
    type:String,
  },
});

module.exports = mongoose.model('Fair', fairSchema);