const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  projectName: { type: String, required: true },
  description: String,
  projectmanager: String,
  cleintcontact: String,
   budg: String,
  location: String,
  startDate: Date,
  validUpto: Date,
  hajriMobile: String,
  logoUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
