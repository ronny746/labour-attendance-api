const Labour = require('../models/labourmodel');
const Attendance = require('../models/attendancemodel');
const Project = require('../models/projectmodel');
const { sendSuccess, sendError } = require('../utils/response');
const User = require('../models/usermodel');
// Add Labour
exports.addLabour = async (req, res) => {
  try {
    const labour = new Labour(req.body);
    await labour.save();
    sendSuccess(res, 'Labour added successfully', labour, 201);
  } catch (err) {
    sendError(res, 'Failed to add labour', err.message, 400);
  }
};

// Get labours by project ID
exports.getLaboursByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return sendError(res, 'Project ID is required', null, 400);
    }

    // 1. Get all labours in the project
    const labours = await Labour.find({ projectId });

    // 2. Define today's time window
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 3. Get today's attendance logs for all labours
    const attendanceLogs = await Attendance.find({
      projectId,
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    });

    // 4. Group attendance by labourId and type
    const attendanceMap = {};
    attendanceLogs.forEach(log => {
      const id = log.labourId.toString();
      if (!attendanceMap[id]) attendanceMap[id] = {};
      attendanceMap[id][log.type] = log.timestamp;
    });

    // 5. Build final response
    const result = labours.map(labour => {
      const log = attendanceMap[labour._id.toString()];
      let status = 'Absent';
      let checkIn = null;
      let checkOut = null;
      let hoursWorked = 0;
      let shift = 0;

      if (log?.['check-in']) {
        checkIn = new Date(log['check-in']);
        if (log?.['check-out']) {
          checkOut = new Date(log['check-out']);
          const diffMs = checkOut - checkIn;
          hoursWorked = diffMs / (1000 * 60 * 60); // in hours

          if (hoursWorked >= 8.75 && hoursWorked <= 9.25) shift = 1;
          else if (hoursWorked > 9.25 && hoursWorked <= 12.5) shift = 1.5;
          else if (hoursWorked > 12.5 && hoursWorked <= 15) shift = 2;
          else if (hoursWorked > 15 && hoursWorked <= 18) shift = 3;
          else if (hoursWorked > 18) shift = 4;
        }

        status = 'Present';
      }


      return {
        ...labour.toObject(),
        attendance: {
          status,
          checkIn: checkIn ? checkIn.toLocaleTimeString() : null,
          checkOut: checkOut ? checkOut.toLocaleTimeString() : null,
          hoursWorked: hoursWorked.toFixed(2),
          shift
        }
      };
    });

    sendSuccess(res, 'Labours with today’s attendance fetched', result, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch labour data', err.message, 500);
  }
};

// Get single labour by ID
exports.getLabourById = async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) return sendError(res, 'Labour not found', null, 404);
    sendSuccess(res, 'Labour fetched successfully', labour, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch labour', err.message, 500);
  }
};

// Update labour
exports.updateLabour = async (req, res) => {
  try {
    const updated = await Labour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return sendError(res, 'Labour not found', null, 404);
    sendSuccess(res, 'Labour updated successfully', updated, 200);
  } catch (err) {
    sendError(res, 'Failed to update labour', err.message, 400);
  }
};

// Delete labour
exports.deleteLabour = async (req, res) => {
  try {
    const deleted = await Labour.findByIdAndDelete(req.params.id);
    if (!deleted) return sendError(res, 'Labour not found', null, 404);
    sendSuccess(res, 'Labour deleted successfully', deleted, 200);
  } catch (err) {
    sendError(res, 'Failed to delete labour', err.message, 400);
  }
};


exports.getLabourSalary = async (req, res) => {
  try {
    const { labourId, startDate, endDate } = req.query;

    if (!labourId || !startDate || !endDate) {
      return sendError(res, 'labourId, startDate and endDate are required', null, 400);
    }

    const labour = await Labour.findById(labourId);
    if (!labour) return sendError(res, 'Labour not found', null, 404);

    const logs = await Attendance.find({
      labourId,
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ timestamp: 1 });

    // Group by date
    const attendanceByDate = {};
    logs.forEach((entry) => {
      const dateKey = entry.timestamp.toISOString().split('T')[0];
      if (!attendanceByDate[dateKey]) attendanceByDate[dateKey] = {};
      attendanceByDate[dateKey][entry.type] = entry.timestamp;
    });



    let totalShifts = 0;
    const dayRecords = [];

    for (const [date, log] of Object.entries(attendanceByDate)) {
      if (log['check-in'] && log['check-out']) {
        const checkIn = new Date(log['check-in']);
        const checkOut = new Date(log['check-out']);

        const graceIn = new Date(checkIn);
        graceIn.setMinutes(graceIn.getMinutes() - 15);

        const graceOut = new Date(checkOut);
        graceOut.setMinutes(graceOut.getMinutes() + 15);

        const diffInMs = checkOut - checkIn;
        const hoursWorked = diffInMs / (1000 * 60 * 60); // ms to hours

        // Determine shift count
        let shift = 0;
        if (hoursWorked >= 8.75 && hoursWorked <= 9.25) shift = 1;
        else if (hoursWorked > 9.25 && hoursWorked <= 12.5) shift = 1.5;
        else if (hoursWorked > 12.5 && hoursWorked <= 15) shift = 2;
        else if (hoursWorked > 15 && hoursWorked <= 18) shift = 3;
        else if (hoursWorked > 18) shift = 4;

        totalShifts += shift;

        dayRecords.push({
          date,
          checkIn: checkIn.toLocaleTimeString(),
          checkOut: checkOut.toLocaleTimeString(),
          hoursWorked: hoursWorked.toFixed(2),
          shift
        });
      }
    }

    const totalSalary = totalShifts * labour.ratePerShift;

    sendSuccess(res, 'Shift-based salary calculated', {
      labour: {
        name: labour.name,
        mobile: labour.mobile,
        ratePerShift: labour.ratePerShift
      },
      totalShifts,
      totalSalary,
      startDate,
      endDate,
      days: dayRecords
    }, 200);
  } catch (err) {
    sendError(res, 'Salary calculation failed', err.message, 500);
  }
};




exports.checkLabourInActiveProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { labourId } = req.params;

    // 1. Get current user
    const user = await User.findById(userId);
    if (!user || !user.mobile) {
      return sendError(res, 'Invalid user', null, 400);
    }

    // 2. Get labour
    const labour = await Labour.findById(labourId);
    if (!labour || !labour.projectId) {
      return sendError(res, 'Labour or project not found', null, 404);
    }

    // 3. Check if the project is active & belongs to the current Hajri Master
    const project = await Project.findOne({
      id: labour.projectId,
      hajriMobile: user.mobile,
      status: true,
      validUpto: { $gte: new Date() }
    });

    if (!project) {
      return sendSuccess(res, 'Labour is not part of any active project', {
        labour: {
          id: labour._id,
          name: labour.name,
        },
        isActive: false,
      }, 200);
    }

    // 4. Check today's attendance for this labour
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayLogs = await Attendance.find({
      labourId: labour._id,
      projectId: project._id,
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    });

    const checkInLog = todayLogs.find(log => log.type === 'check-in');
    const checkOutLog = todayLogs.find(log => log.type === 'check-out');

    let nextAction = 'check-in';
    if (checkInLog && !checkOutLog) nextAction = 'check-out';
    else if (checkInLog && checkOutLog) nextAction = 'completed';

    return sendSuccess(res, 'Labour and attendance status fetched', {
      labour: {
        id: labour._id,
        name: labour.name,
      },
      project: {
        id: project._id,
        name: project.projectName,
      },
      isActive: true,
      todayAttendance: {
        checkIn: checkInLog?.timestamp,
        checkOut: checkOutLog?.timestamp,
        nextAction: nextAction
      }
    }, 200);

  } catch (err) {
    sendError(res, 'Check failed', err.message, 500);
  }
};
