const express = require('express');
const router = express.Router();
const labourController = require('../controllers/labourcontroller');

// Add labour to a project
router.post('/', labourController.addLabour);

// Get all labours for a project
router.get('/:projectId', labourController.getLaboursByProject);

module.exports = router;
