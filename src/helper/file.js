const multer = require('multer');

const multerConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 6 * 1024 * 1024,
  },
});

const upload = multer(multerConfig);

module.exports = upload;
