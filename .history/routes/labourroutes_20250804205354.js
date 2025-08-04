const express = require('express');
const router = express.Router();
const labourController = require('../controllers/labourcontroller');
const { verifyToken } = require('../middlewares/authmiddleware');

router.post('/', verifyToken, labourController.addLabour);
router.get('/project/:projectId', verifyToken, labourController.getLaboursByProject);
router.get('/:id', verifyToken, labourController.getLabourById);
router.put('/:id', verifyToken, labourController.updateLabour);
router.delete('/:id', verifyToken, labourController.deleteLabour);

module.exports = router;
