const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Send OTP
router.post('/send-otp', authController.sendOtp);

// Verify OTP
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;
