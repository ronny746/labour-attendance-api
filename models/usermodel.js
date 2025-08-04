const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  mobile: { type: String, unique: true, required: true },
  lastOtp: String,
  masterId: String,
  profile: String,
  role: { type: String, enum: ['admin', 'manager', 'staff'], default: 'admin' },
  designation: String,
  email: String,
  companyName: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
