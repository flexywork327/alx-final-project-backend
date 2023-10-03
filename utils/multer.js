const multer = require("multer");

// set storage engine
module.exports = multer({
  storage: multer.diskStorage({}),

  fileFilter: (req, file, cb) => {
    // reject a file
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
