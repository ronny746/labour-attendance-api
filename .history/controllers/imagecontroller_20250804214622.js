const { sendSuccess, sendError } = require('../utils/response');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return sendError(res, 'No image uploaded', null, 400);
    }

    sendSuccess(res, 'Image uploaded successfully', { url: req.file.path }, 200);
  } catch (err) {
    sendError(res, 'Image upload failed', err.message, 500);
  }
};
