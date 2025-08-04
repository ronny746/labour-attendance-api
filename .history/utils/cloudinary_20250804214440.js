const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
     publicKey: "public_K8S/Lhh2WHGSLSj59jQ9lPPLSBw=",
    privateKey: "private_vhNSf+Re+o39wKE+zlE6YwawANQ=",
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
