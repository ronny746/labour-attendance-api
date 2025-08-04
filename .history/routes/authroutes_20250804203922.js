const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const { verifyToken } = require('../middlewares/authmiddleware');
// Send OTP
router.post('/send-otp', authController.sendOtp);

// Verify OTP
router.post('/verify-otp', authController.verifyOtp);

router.get('/profile', verifyToken, authController.getUserProfile);

router.put('/update-profile', verifyToken, authController.updateUserProfile);


module.exports = router;
