const Fair = require('../models/Fair');

const GroupSupervisor = require('../models/GroupSupervisor');

exports.createFair = async (req, res) => {
  console.log("creating fair")
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

    const fair = new Fair({
      schoolName,
      city,
      date,
      hour,
      numberOfStudents,
      groupSupervisor,
      notes,
      email,
    });

    await fair.save();
    res.status(201).json({ message: 'Fair request submitted successfully', fair });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateFair = async (req, res) => {
  try {
    const fairId = req.params.id;
    const updates = req.body;

    const fair = await Fair.findByIdAndUpdate(fairId, updates, { new: true });

    if (!fair) {
      return res.status(404).json({ message: 'Fair not found' });
    }

    res.status(200).json({ message: 'Fair updated successfully', fair});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getFairs = async (req, res) => {
  try {
    const fairs = await Fair.find()
      .populate('attainedGuide', 'username')
      .populate('groupSupervisor', 'name')
    res.status(200).json({ fairs });
  } catch (error) {
    console.error('Error fetching fairs:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
