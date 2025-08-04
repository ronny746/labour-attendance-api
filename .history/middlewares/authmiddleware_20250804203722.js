const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Token missing' });
  }

  try {
    const decoded = jwt.verify(token, '');
    req.user = decoded; // Add decoded user to request
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};
