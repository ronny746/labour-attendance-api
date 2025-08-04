const mongoose = require('mongoose');

const appInfoSchema = new mongoose.Schema({
  name: String,
  version: String,
  description: String,
  contactEmail: String,
  supportPhone: String,
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AppInfo', appInfoSchema);
