function extractFirstWord(message) {
  if (!message || typeof message !== 'string') return '';
  return message.trim().split(' ')[0];
}

exports.sendSuccess = (res, message, data = null, code = 200) => {
  const key = extractFirstWord(message);
  res.status(code).json({
    success: true,
    message,
    [key]: data, // dynamic key
    statuscode: code
  });
};

exports.sendError = (res, message, error = null, code = 400) => {
  res.status(code).json({
    success: false,
    message,
    error,
    statuscode: code
  });
};
