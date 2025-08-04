const AppInfo = require('../models/appinfomodel');
const { sendSuccess, sendError } = require('../utils/response');

// Public - Get app info
exports.getAppInfo = async (req, res) => {
  try {
    const info = await AppInfo.findOne().sort({ updatedAt: -1 });
    if (!info) return sendError(res, 'App info not found', null, 404);
    sendSuccess(res, 'App info fetched', info, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch app info', err.message, 500);
  }
};

// Admin - Update app info
exports.updateAppInfo = async (req, res) => {
  try {
    const updated = await AppInfo.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true
    });
    sendSuccess(res, 'App info updated', updated, 200);
  } catch (err) {
    sendError(res, 'Failed to update app info', err.message, 400);
  }
};
