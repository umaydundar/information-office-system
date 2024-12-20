const Tour = require('../models/Tour');
const TourFeedback = require('../models/TourFeedback');

const GroupSupervisor = require('../models/GroupSupervisor');


exports.createTour = async (req, res) => {
  console.log("creating tour")
  try {
    const {
      schoolName,
      city,
      date,
      hour,
      numberOfStudents,
      groupSupervisor,
      notes,
      email,
    } = req.body;

    const tour = new Tour({
      schoolName,
      city,
      date,
      hour,
      numberOfStudents,
      groupSupervisor,
      notes,
      email,
      // attainedGuide remains unassigned
    });

    await tour.save();
    res.status(201).json({ message: 'Tour request submitted successfully', tour });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const updates = req.body;

    const tour = await Tour.findByIdAndUpdate(tourId, updates, { new: true });

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.status(200).json({ message: 'Tour updated successfully', tour });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find()
      .populate('attainedGuide', 'username name surname profilePic email phone') // Ensure profilePic is included
      .populate('groupSupervisor', 'name phoneNumber email') // Ensure supervisor fields like phoneNumber are included
      .populate('tourFeedback', 'rating date') // Include rating and date from feedback
      //.select('schoolName city date hour numberOfStudents notes status attainedGuide groupSupervisor'); // Explicitly select relevant fields

    res.status(200).json({ tours });
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await TourFeedback.find()
      .populate('guide', 'username')
      .populate('tour', 'date');
    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
