const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  labourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labour', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  type: { type: String, enum: ['check-in', 'check-out'], required: true },
  location: {
    lat: Number,
    long: Number
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
