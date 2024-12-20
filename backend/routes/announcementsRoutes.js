const express = require('express');
const router = express.Router();
// If you have Announcement model, use it. If not, create one or in-memory.

const Announcement = require('../models/Announcement'); // Assume a model

router.get('/list', async (req,res) => {
  // Retrieve announcements from DB
  const announcements = await Announcement.find({}).sort({date:-1});
  res.json({announcements});
});

router.post('/add', async (req,res) => {
  const { summary, description } = req.body;
  if(!summary || !description) {
    return res.status(400).json({error:'Summary and description required'});
  }

  const announcement = new Announcement({summary, description, date:new Date()});
  await announcement.save();
  res.json({message:'Announcement added', announcement});
});

module.exports = router;
