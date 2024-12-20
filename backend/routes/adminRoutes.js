const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create-user', adminController.createUser);
router.get('/users', adminController.getAllUsers);
router.put('/update-user/:id', adminController.updateUserInfo);
router.delete('/delete-user/:id', adminController.deleteUser);
router.get('/get-user/:id', adminController.getUser);

module.exports = router;
