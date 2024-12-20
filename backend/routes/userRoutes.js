const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/multerConfig'); // Import Multer configuration

router.post('/submit-request', userController.submitTour);


router.get('/users', userController.getAllUsers);
router.post('/update-user/:id', userController.updateUser);
router.post('/upload-profile-pic/:id', upload.single('profilePic'), userController.uploadProfilePic);
module.exports = router;
