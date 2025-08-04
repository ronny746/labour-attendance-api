const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectcontroller');
const { verifyToken } = require('../middlewares/authmiddleware');

router.post('/', verifyToken, projectController.createProject);
router.get('/', verifyToken, projectController.getAllProjects);

module.exports = router;
