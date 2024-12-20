const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
console.log("before route");
router.post('/forgot_password', authController.forgotPassword);

module.exports = router;