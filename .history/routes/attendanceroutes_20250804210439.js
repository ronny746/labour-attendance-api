const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/mark', verifyToken, attendanceController.markAttendance);
router.get('/', verifyToken, attendanceController.getAttendanceLogs);

module.exports = router;
