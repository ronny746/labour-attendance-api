exports.sendSuccess = (res, message, data = null, statusCode = 200) => {
  res.status(code).json({ success: true, message, data, statusCode});
};

exports.sendError = (res, message, error = null, code = 400) => {
  res.status(code).json({ success: false, message, error ,code});
};
