const mongoose = require ('mongoose');

const classSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    building: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['available', 'assigned','in-use'],
      default: 'pending',
    },
    hours: {
      type: String,
      enum: ['09:00-11:00', '11:00-13:30' ,'13:30-16:00', '16:00-18:00'],
    }
});


module.exports = mongoose.model('Class',classSchema);