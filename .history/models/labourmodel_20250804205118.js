const mongoose = require('mongoose');

const labourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: Date,
  degination: String,
  rate: int,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  photoUrl: String,
  mobile: { type: String, required: true },
  aadhaar: String,
  UnionId
  joiningFrom: Date,
  validUpto: Date,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
}, { timestamps: true });

module.exports = mongoose.model('Labour', labourSchema);
