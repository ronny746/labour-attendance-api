const Labour = require('../models/labourmodel');
const { sendSuccess, sendError } = require('../utils/response');

exports.addLabour = async (req, res) => {
  try {
    const labour = new Labour(req.body);
    await labour.save();

    sendSuccess(res, 'Labour added successfully', labour, 201);
  } catch (err) {
    sendError(res, 'Failed to add labour', err.message, 400);
  }
};

exports.getLaboursByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const labours = await Labour.find({ projectId });

    sendSuccess(res, 'Labours fetched successfully', labours, 200);
  } catch (err) {
    sendError(res, 'Failed to fetch labours', err.message, 500);
  }
};
