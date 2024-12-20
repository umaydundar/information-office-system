const Class = require('../models/Class');

exports.createClassroom = async (req, res) => {
  console.log("creating tour")
  try {
    const {
      name,
      building,
      status,
      hours,
    } = req.body;

    const classroom = new Class({
      name,
      building,
      status,
      hours,
    });

    await classroom.save();
    res.status(201).json({ message: 'Classroom created successfully', classroom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateClassroom = async (req, res) => {
  const classroomId = req.params.id;
  console.log(classroomId);
  const updates = req.body;

  try {
    const classroom = await Class.findById(classroomId);
    console.log(classroom);
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    classroom.name = updates.name || classroom.name;
    classroom.building = updates.building || classroom.building;
    classroom.status = updates.status|| classroom.status;
    classroom.hours = updates.hours || classroom.hours;
    await classroom.save();

    res.status(200).json({ message: 'Classroom updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating classroom' });
  }
};

exports.getClassrooms = async (req, res) => {
  try {
    const classroom = await Class.find()
      .populate('name', 'name')
      .populate('building', 'building')
      .populate('status', 'status')
      .populate('hours', 'hours');
    res.status(200).json({ classroom });
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteClassroom = async (req, res) => {
  const classroomId = req.params.id;

  try {
    await Class.findByIdAndDelete(classroomId);
    res.status(200).json({ message: 'Classroom deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting classroom' });
  }
};

exports.getClassroom  = async (req, res) => {
  const classroomId = req.params.id;
  try {
    const classroom = await Class.findById(classroomId);

    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }
    else
    {
      res.status(200).json({ classroom });
    }
  }catch (error) {
    res.status(500).json({ error: 'Error fetching classroom' });
  }
};