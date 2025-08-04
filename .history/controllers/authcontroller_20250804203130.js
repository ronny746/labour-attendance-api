const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const { sendSuccess, sendError } = require('../utils/response');

exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let user = await User.findOne({ mobile });
    if (!user) {
      user = new User({ mobile, lastOtp: otp });
    } else {
      user.lastOtp = otp;
    }

    await user.save();

    // Simulate WhatsApp/send here
    console.log(`OTP sent to ${mobile}: ${otp}`);

    sendSuccess(res, 'OTP sent successfully', { otp }, 200); // Remove `otp` in production
  } catch (err) {
    sendError(res, 'Failed to send OTP', err.message, 500);
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const user = await User.findOne({ mobile });

    if (!user || user.lastOtp !== otp) {
      return sendError(res, 'Invalid OTP', null, 400);
    }

    // user.lastOtp = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    sendSuccess(res, 'Login successful', { user, token }, 200);
  } catch (err) {
    sendError(res, 'Failed to verify OTP', err.message, 500);
  }
};