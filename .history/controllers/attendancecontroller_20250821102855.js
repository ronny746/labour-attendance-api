const Attendance = require('../models/attendancemodel');
const { sendSuccess, sendError } = require('../utils/response');
const User = require('../models/usermodel');
const Project = require('../models/projectmodel');
const Labour = require('../models/labourmodel');
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
    const user = await User.findById(req.user.id);
    if (!user || !user.mobile) {
      return sendError(res, 'Invalid user or mobile not found', null, 400);
    }

    // Fetch all projects under this hazri master
    const projects = await Project.find({ hajriMobile: user.mobile }).sort({ createdAt: -1 });
    if (!projects.length) {
      return sendSuccess(res, 'No projects found for this hazri master', [], 200);
    }

    // Date filter from query
    let { startDate, endDate } = req.query;
    if (!startDate) startDate = new Date().toISOString().slice(0, 10);
    if (!endDate) endDate = startDate;

    const from = new Date(startDate);
    from.setHours(0, 0, 0, 0);
    const to = new Date(endDate);
    to.setHours(23, 59, 59, 999);

    const report = [];

    for (const project of projects) {
      const labours = await Labour.find({ projectId: project._id }).sort({ name: 1 });

      const records = await Attendance.find({
        projectId: project._id,
        timestamp: { $gte: from, $lte: to }
      })
        .populate('labourId')
        .sort({ timestamp: 1 });

      const projectReport = {};
      records.forEach((entry) => {
        const dateStr = entry.timestamp.toISOString().slice(0, 10);
        const labour = entry.labourId;
        const id = labour._id.toString();

        if (!projectReport[dateStr]) projectReport[dateStr] = {};

        if (!projectReport[dateStr][id]) {
          projectReport[dateStr][id] = {
            name: labour.name,
            mobile: labour.mobile,
            designation: labour.designation,
            checkIn: null,
            checkOut: null
          };
        }

        if (entry.type === 'check-in') {
          projectReport[dateStr][id].checkIn = entry.timestamp.toLocaleTimeString();
        } else if (entry.type === 'check-out') {
          projectReport[dateStr][id].checkOut = entry.timestamp.toLocaleTimeString();
        }
      });

      // Build response for each date in range
      const allDates = [];
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        allDates.push(new Date(d));
      }

      const formattedReport = allDates.map((d) => {
        const dateStr = d.toISOString().slice(0, 10);
        const employees = labours.map((labour) => {
          const id = labour._id.toString();
          return projectReport[dateStr] && projectReport[dateStr][id]
            ? projectReport[dateStr][id]
            : {
                name: labour.name,
                mobile: labour.mobile,
                designation: labour.designation,
                checkIn: null,
                checkOut: null
              };
        });
        return { date: dateStr, employees };
      });

      report.push({
        projectId: project._id,
        projectName: project.projectName,
        attendance: formattedReport
      });
    }

    sendSuccess(res, 'Attendance report fetched successfully', report, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch attendance reports', err.message, 500);
  }
};