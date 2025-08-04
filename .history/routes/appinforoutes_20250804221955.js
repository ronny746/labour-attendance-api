const express = require('express');
const router = express.Router();
const appInfoController = require('../controllers/appdetailscontroller');
const { verifyToken } = require('../middlewares/authmiddleware');

// Public route
router.get('/', appInfoController.getAppInfo);

// Admin-protected update route
router.put('/', verifyToken, appInfoController.updateAppInfo);

module.exports = router;
