const multer = require("multer"); // handles multipart form data
const uuid = require("uuid").v4; // can be used to create a string on an upload for its filename so that theyre all unique

const upload = multer({
  storage: multer.diskStorage({ // stores the file on disk
    destination: "product-data/images", // and sets the destination of the image we're uploading.
    filename: function (req, file, cb) {
      // takes the requst, the file, and the callback function
      cb(null, uuid() + "-" + file.originalname); // the process of adding the uuid to the filename, IE throwing it in front of the original file
    },
  }),
});

const configuredMulterMiddleware = upload.single("image");

module.exports = configuredMulterMiddleware;
