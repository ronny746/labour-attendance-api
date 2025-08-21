const Attendance = require('../models/attendancemodel');
const { sendSuccess, sendError } = require('../utils/response');

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { labourId, projectId, type, location } = req.body;

    // Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Check if same type already exists today
    const existing = await Attendance.findOne({
      labourId,
      type,
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existing) {
      return sendError(
        res,
        `You already marked a ${type} today.`,
        null,
        400
      );
    }

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

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get today's attendance for the project
    const records = await Attendance.find({
      projectId,
      timestamp: { $gte: todayStart, $lte: todayEnd }
    })
      .populate('labourId')
      .sort({ timestamp: 1 });

    // Group check-in/out by labourId
    const summary = {};

    records.forEach((entry) => {
      const labour = entry.labourId;
      const id = labour._id.toString();

      if (!summary[id]) {
        summary[id] = {
          name: labour.name,
          mobile: labour.mobile,
          date: entry.timestamp.toISOString().slice(0, 10),
          checkIn: null,
          checkOut: null
        };
      }

      if (entry.type === 'check-in') {
        summary[id].checkIn = entry.timestamp.toLocaleTimeString();
      } else if (entry.type === 'check-out') {
        summary[id].checkOut = entry.timestamp.toLocaleTimeString();
      }
    });

    const response = Object.values(summary);

    sendSuccess(res, 'Today\'s check-in/out summary', response, 200);
  } catch (err) {
    sendError(res, 'Failed to get today\'s logs', err.message, 500);
  }
};

// Get attendance report for all employees under a project (hazri master) date-wise
exports.getAttendanceReportByProject = async (req, res) => {
  try {
    const { projectId, startDate, endDate } = req.query;

    if (!projectId) {
      return sendError(res, 'Project ID is required', null, 400);
    }

    // Date range filter
    const from = startDate ? new Date(startDate) : new Date();
    from.setHours(0, 0, 0, 0);

    const to = endDate ? new Date(endDate) : new Date();
    to.setHours(23, 59, 59, 999);

    // Fetch all attendance records for this project in the date range
    const records = await Attendance.find({
      projectId,
      timestamp: { $gte: from, $lte: to }
    })
      .populate('labourId')
      .sort({ timestamp: 1 });

    // Group by date -> employee
    const report = {};

    records.forEach((entry) => {
      const date = entry.timestamp.toISOString().slice(0, 10); // YYYY-MM-DD
      const labour = entry.labourId;
      const id = labour._id.toString();

      if (!report[date]) report[date] = {};

      if (!report[date][id]) {
        report[date][id] = {
          name: labour.name,
          mobile: labour.mobile,
          checkIn: null,
          checkOut: null
        };
      }

      if (entry.type === 'check-in') {
        report[date][id].checkIn = entry.timestamp.toLocaleTimeString();
      } else if (entry.type === 'check-out') {
        report[date][id].checkOut = entry.timestamp.toLocaleTimeString();
      }
    });

    // Convert report object to array format
    const response = Object.keys(report).map((date) => ({
      date,
      employees: Object.values(report[date])
    }));

    sendSuccess(res, 'Attendance report fetched successfully', response, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch attendance report', err.message, 500);
  }
};
