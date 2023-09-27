const multer = require('multer');


const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/images')
    },
    filename: function (req, file, cb) {
      cb(null, `${new Date().toISOString().replace(/:/g, "-")}-${file.originalname}`)
    }
  })
  
 module.exports = multer({ storage: fileStorage });