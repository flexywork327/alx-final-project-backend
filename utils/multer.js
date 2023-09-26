const multer = require("multer");

// set storage engine
module.exports = multer({
  storage: multer.diskStorage({}),

  fileFilter: (req, file, cb) => {
    // reject a file
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(
        {
          message: "File type not supported",
        },
        false
      );
    }
  },
});
