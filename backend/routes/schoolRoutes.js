const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');


router.get('/list', schoolController.getSchools);

module.exports = router;
