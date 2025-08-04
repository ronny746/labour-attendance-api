const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });
const { uploadImage } = require('../controllers/upload.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/image', verifyToken, upload.single('image'), uploadImage);

module.exports = router;
