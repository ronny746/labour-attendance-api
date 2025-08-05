exports.sendSuccess = (res, message, data = null, code = 200) => {
  res.status(code).json({ success: true, message,  data, statuscode: code });
};

exports.sendError = (res, message, error = null, code = 400) => {
  res.status(code).json({ success: false, message, error, statuscode: code });
};
function extractFirstWord(message) {
  if (!message || typeof message !== 'string') return '';
  return message.trim().split(' ')[0];
}
