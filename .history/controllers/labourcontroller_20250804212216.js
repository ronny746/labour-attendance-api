const Labour = require('../models/labourmodel');
const Labour = require('../models/labour.model');
const Attendance = require('../models/attendance.model');
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

    // Group by date: if both check-in and check-out exist => count as full day
    const attendanceByDate = {};

    logs.forEach(log => {
      const date = log.timestamp.toISOString().split('T')[0];
      if (!attendanceByDate[date]) attendanceByDate[date] = { checkIn: null, checkOut: null };

      if (log.type === 'check-in') attendanceByDate[date].checkIn = log.timestamp;
      if (log.type === 'check-out') attendanceByDate[date].checkOut = log.timestamp;
    });

    const fullDays = Object.values(attendanceByDate).filter(day => day.checkIn && day.checkOut).length;
    const totalSalary = fullDays * labour.rate;

    sendSuccess(res, 'Salary calculated', {
      name: labour.name,
      mobile: labour.mobile,
      rate: labour.rate,
      fullDays,
      totalSalary,
      period: { startDate, endDate }
    }, 200);
  } catch (err) {
    sendError(res, 'Failed to calculate salary', err.message, 500);
  }
};
