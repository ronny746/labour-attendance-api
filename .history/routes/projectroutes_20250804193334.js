const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectcontroller');

// Create new project
router.post('/', projectController.createProject);

// Get all projects
router.get('/', projectController.getAllProjects);

module.exports = router;
