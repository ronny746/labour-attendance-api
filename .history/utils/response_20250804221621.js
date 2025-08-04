exports.sendSuccess = (res, message, data = null, code = 200) => {
  res.status(code).json({ success: true, message, data, code});
};

exports.sendError = (res, message, error = null, code = 400) => {
  res.status(code).json({ success: false, message, error });
};
