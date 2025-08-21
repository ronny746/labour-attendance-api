const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendancecontroller');
const { verifyToken } = require('../middlewares/authmiddleware');

router.post('/mark', verifyToken, attendanceController.markAttendance);
router.get('/', verifyToken, attendanceController.getAttendanceLogs);

router.get('/today-checkins/:projectId', verifyToken, attendanceController.getTodayCheckInsByProject);
router.get('/getAttendanceReportByProject/', verifyToken, attendanceController.getAttendanceReportByProject);

module.exports = router;
