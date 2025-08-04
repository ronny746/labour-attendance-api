const User = require('../models/usermodel');

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
    res.json({ message: 'OTP sent successfully', otp }); // Remove `otp` in production
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const user = await User.findOne({ mobile });

    if (!user || user.lastOtp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    user.lastOtp = null;
    await user.save();

    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
