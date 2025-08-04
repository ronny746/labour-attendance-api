const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');

// Create new project
router.post('/', projectController.createProject);

// Get all projects
router.get('/', projectController.getAllProjects);

module.exports = router;
