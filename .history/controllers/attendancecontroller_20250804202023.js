const Attendance = require('../models/attendancemodel');

exports.markAttendance = async (req, res) => {
  try {
    const { labourId, projectId, type, location } = req.body;

    const attendance = new Attendance({ labourId, projectId, type, location });
    await attendance.save();

    // (Optional) Send WhatsApp notification from utils/whatsapp.service.js

    res.status(201).json({ message: "Attendance marked", data: attendance });
    sendSuccess(res, 'ttendance marked', project, 201);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
