const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  projectName: { type: String, required: true },
  description: { type: String, default: '' },
  projectmanager: { type: String, required: true },
  masterId:
  cleintcontact: { type: String }, // optional
  budget: { type: String, required: true },
  status: { type: Boolean, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  validUpto: { type: Date, required: true },
  hajriMobile: { type: String, required: true },
  logoUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
