const mongoose = require('mongoose');

const labourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  degination: { type: String, required: true },
  ratePerShift: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  photoUrl: { type: String, required: true },
  photoUrl: { type: String, required: true },
  mobile: { type: String, required: true },
  aadhaar: { type: Number },
  UnionId: { type: String },
  joiningFrom: { type: Date, required: true },
  validUpto: { type: Date, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
}, { timestamps: true });

// ✅ Ensure either Aadhaar or UnionId is provided
labourSchema.pre('validate', function (next) {
  if (!this.aadhaar && !this.UnionId) {
    this.invalidate('aadhaar', 'Either Aadhaar or UnionId is required');
    this.invalidate('UnionId', 'Either Aadhaar or UnionId is required');
  }
  next();
});

module.exports = mongoose.model('Labour', labourSchema);
