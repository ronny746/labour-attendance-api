const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');

// Send OTP
router.post('/send-otp', authController.sendOtp);

// Verify OTP
router.post('/verify-otp', authController.verifyOtp);

router.put('/update-profile', verifyToken, authController.updateUserProfile);


module.exports = router;
