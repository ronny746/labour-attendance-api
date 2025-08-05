exports.sendSuccess = (res, message, data = null, code = 200) => {
  res.status(code).json({ success: true, message, data, statuscode: code });
};

exports.sendError = (res, message, error = null, code = 400) => {
  res.status(code).json({ success: false, message, error, statuscode: code });
};
String extractFirstWord(String message) {
  if (message.trim().isEmpty) return '';
  return message.trim().split(' ').first;
}