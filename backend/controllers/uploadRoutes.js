// server/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Use multer to handle file upload from form-data
const upload = multer({ dest: 'uploads/' }); // In real scenario, set proper storage

router.post('/profile-pic', upload.single('profilePic'), (req, res) => {
  // In real scenario, upload image to storage and get URL
  // Here we just return a fake URL based on the filename
  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

module.exports = router;
