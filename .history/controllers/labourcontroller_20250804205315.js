const Labour = require('../models/labourmodel');
const { sendSuccess, sendError } = require('../utils/response');

// Add Labour
exports.addLabour = async (req, res) => {
  try {
    const labour = new Labour(req.body);
    await labour.save();
    sendSuccess(res, 'Labour added successfully', labour, 201);
  } catch (err) {
    sendError(res, 'Failed to add labour', err.message, 400);
  }
};

// Get labours by project ID
exports.getLaboursByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const labours = await Labour.find({ projectId });
    sendSuccess(res, 'Labours fetched successfully', labours, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch labours', err.message, 500);
  }
};

// Get single labour by ID
exports.getLabourById = async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) return sendError(res, 'Labour not found', null, 404);
    sendSuccess(res, 'Labour fetched successfully', labour, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch labour', err.message, 500);
  }
};

// Update labour
exports.updateLabour = async (req, res) => {
  try {
    const updated = await Labour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return sendError(res, 'Labour not found', null, 404);
    sendSuccess(res, 'Labour updated successfully', updated, 200);
  } catch (err) {
    sendError(res, 'Failed to update labour', err.message, 400);
  }
};

// Delete labour
exports.deleteLabour = async (req, res) => {
  try {
    const deleted = await Labour.findByIdAndDelete(req.params.id);
    if (!deleted) return sendError(res, 'Labour not found', null, 404);
    sendSuccess(res, 'Labour deleted successfully', deleted, 200);
  } catch (err) {
    sendError(res, 'Failed to delete labour', err.message, 400);
  }
};
