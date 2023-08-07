const path = require('path');
const multer = require('multer');

const uploadFilePath = path.resolve(__dirname, '../..', 'public/uploads');

const storageFile = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, uploadFilePath);
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}_${file.originalname}`);
  },
});

const uploadFile = multer({
  storage: storageFile,
  // limits: { fileSize: 5 * 1024 * 1024 },
  // fileFilter(req, file, callback) {
  //   const extension = ['.png', '.jpg', '.jpeg', '.mp4', '.avi', '.mov', '.mpg'].indexOf(path.extname(file.originalname).toLowerCase()) >= 0;
  //   const mimeType = ['image/png', 'image/jpg', 'image/jpeg', 'video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/webm', 'video/mpeg'].indexOf(file.mimetype) >= 0;
    
  //   if (extension && mimeType) {
  //     return callback(null, true);
  //   }
    
  //   callback(new Error(`Invalid file type(${extension}, ${mimeType}). Only photo/video file on type PNG and JPG are allowed!`));
  // },
}).single('file');

const handleSingleUploadFile = async (req, res) => {
  return new Promise((resolve, reject) => {
    uploadFile(req, res, (error) => {
      if (error) {
        reject(error);
      }
      
      resolve({ file: req.file, body: req.body });
    });
  });
};

module.exports = handleSingleUploadFile;
//export { handleSingleUploadFile };