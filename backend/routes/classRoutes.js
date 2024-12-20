const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController'); 


router.post('/create', classController.createClassroom);
router.get('/classes', classController.getClassrooms);
router.put('/update/:id', classController.updateClassroom);
router.delete('/delete/:id', classController.deleteClassroom);
router.get('/get/:id', classController.getClassroom);

module.exports = router;
