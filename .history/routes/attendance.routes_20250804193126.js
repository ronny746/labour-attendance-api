const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendancecontroller');

// Mark attendance (check-in/check-out)
router.post('/mark', attendanceController.markAttendance);

// Get attendance logs
router.get('/', attendanceController.getAttendanceLogs);

module.exports = router;
