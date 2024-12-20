const express = require('express');
const router = express.Router();
const fairController = require('../controllers/fairController');

router.post('/create', fairController.createFair);
router.put('/update/:id', fairController.updateFair);
router.get('/list', fairController.getFairs);

  
module.exports = router;
