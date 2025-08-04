const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: "dovqqcbxc",
  api_key:    '754921313586888',
  api_secret: "FrC0yUxxg8Y0N5xbBQtlsb0WS5o"
});
 apiKey: '754921313586888',
    apiSecret: 'FrC0yUxxg8Y0N5xbBQtlsb0WS5o',
    cloudName: 'dovqqcbxc',
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'labour-photos',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => Date.now() + '-' + file.originalname
  }
});

module.exports = {
  cloudinary,
  storage
};
