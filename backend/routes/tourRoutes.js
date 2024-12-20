const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

// Define routes to create, update, and fetch tours
router.post('/create', tourController.createTour);
router.put('/update/:id', tourController.updateTour);
router.get('/list', tourController.getTours);
router.get('/feedbacks', tourController.getFeedbacks);

  
module.exports = router;
