const Attendance = require('../models/attendancemodel');
const { sendSuccess, sendError } = require('../utils/response');

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { labourId, projectId, type, location } = req.body;

    const attendance = new Attendance({ labourId, projectId, type, location });
    await attendance.save();

    sendSuccess(res, 'Attendance marked successfully', attendance, 201);
  } catch (err) {
    sendError(res, 'Failed to mark attendance', err.message, 400);
  }
};

// Get all attendance logs with filters
exports.getAttendanceLogs = async (req, res) => {
  try {
    const { labourId, projectId } = req.query;
    const filter = {};
    if (labourId) filter.labourId = labourId;
    if (projectId) filter.projectId = projectId;

    const logs = await Attendance.find(filter)
      .populate('labourId')
      .populate('projectId')
      .sort({ timestamp: -1 });

    sendSuccess(res, 'Attendance logs fetched successfully', logs, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch logs', err.message, 500);
  }
};

exports.getTodayCheckInsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return sendError(res, 'Project ID is required', null, 400);
    }

    // Get today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const logs = await Attendance.find({
      projectId,
      type: 'check-in',
      timestamp: { $gte: todayStart, $lte: todayEnd }
    })
      .populate('labourId')
      .sort({ timestamp: -1 });

    sendSuccess(res, 'Today\'s check-ins fetched successfully', logs, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch today\'s check-ins', err.message, 500);
  }
};

