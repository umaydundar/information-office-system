const Tour = require('../models/Tour');

exports.submitTour = async (req, res) => {
  const { groupName, numberOfPeople, requestedDate } = req.body;
  const newRequest = new Tour({
    groupName,
    numberOfPeople,
    requestedDate,
  });
  try {
    await newRequest.save();
    res.status(200).json({ message: 'Tour request submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting tour request' });
  }
};


const User = require('../models/User');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const fs = require('fs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, password, name, surname, profilePic, weeklySchedule, email, phone, score } = req.body;

  const updates = {};
  if (username) updates.username = username;
  if (password) updates.password = password;
  if (name) updates.name = name;
  if (surname) updates.surname = surname;
  if (profilePic) updates.profilePic = profilePic;
  if (weeklySchedule) updates.weeklySchedule = weeklySchedule;
  if (email) updates.email = email;
  if (phone) updates.phone = phone;
  if (score) updates.score = score;

  try {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

exports.uploadProfilePic = async (req, res) => {
  const userId = req.params.id;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: fileUrl },
      { new: true }
    );

    if (!user) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading profile picture' });
  }
};
