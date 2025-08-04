const Attendance = require('../models/attendancemodel');

exports.markAttendance = async (req, res) => {
  try {
    const { labourId, projectId, type, location } = req.body;

    const attendance = new Attendance({ labourId, projectId, type, location });
    await attendance.save();

    // (Optional) Send WhatsApp notification from utils/whatsapp.service.js
    sendSuccess(attendance, 'attendance marked', project, 201);
  } catch (err) {
    sendError(err.message , 'Project creation failed', err.message);

  }
};

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

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
