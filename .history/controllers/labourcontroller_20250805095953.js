const Labour = require('../models/labourmodel');
const Attendance = require('../models/attendancemodel');
const { sendSuccess, sendError } = require('../utils/response');

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
    const projectId = req.params.projectId;
    const labours = await Labour.find({ projectId });
    sendSuccess(res, 'Labours fetched successfully', labours, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch labours', err.message, 500);
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

    console.log(attendanceByDate);

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
        rate: labour.ratePerShift
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
