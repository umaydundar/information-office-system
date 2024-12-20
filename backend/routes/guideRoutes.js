// Example in /server/routes/guideRoutes.js

const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/availability', authMiddleware, guideController.setAvailability);
router.get('/scorecard', authMiddleware, guideController.getScorecard);

module.exports = router;
