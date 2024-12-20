const mongoose = require('mongoose');
const GroupSupervisor = require('../models/GroupSupervisor');

exports.findOrCreateSupervisor = async (req, res) => {
  try {
    // If _id is passed in query parameters, fetch supervisor by _id
    if (req.query._id) {
      console.log(req.query._id); // Debugging log to check the _id value

      // Check if _id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(req.query._id)) {
        return res.status(400).json({ error: 'Invalid _id format' });
      }

      // Convert _id to ObjectId and fetch supervisor
      const supervisor = await GroupSupervisor.findById(req.query._id);
      
      if (!supervisor) {
        return res.status(404).json({ error: 'Supervisor not found' });
      }
  
      return res.status(200).json({ groupSupervisor: supervisor });
    }

    // Otherwise, handle create or find by email logic
    const { name, title, email, phoneNumber } = req.body;

    let supervisor = await GroupSupervisor.findOne({ email });

    if (!supervisor) {
      supervisor = new GroupSupervisor({
        name,
        title,
        email,
        phoneNumber,
      });
      await supervisor.save();
      console.log("new supervisor created");
    } else {
      console.log("supervisor already exists");
    }

    res.status(200).json({ groupSupervisor: supervisor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
