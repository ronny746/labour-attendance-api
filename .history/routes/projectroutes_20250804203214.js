const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectcontroller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, projectController.createProject);
router.get('/', verifyToken, projectController.getAllProjects);

module.exports = router;
