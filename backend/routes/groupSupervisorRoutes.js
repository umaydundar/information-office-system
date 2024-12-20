const express = require('express');
const router = express.Router();
const groupSupervisorController = require('../controllers/groupSupervisorController');

// Route to find or create a group supervisor
router.post('/find-or-create', groupSupervisorController.findOrCreateSupervisor);

module.exports = router;
