const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  projectName: { type: String, required: true },
  location: String,
  location: String,
  location: String,
  location: String,
  startDate: Date,
  validUpto: Date,
  hajriMobile: String,
  logoUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
