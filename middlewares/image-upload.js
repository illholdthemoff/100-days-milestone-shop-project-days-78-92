const multer = require("multer");
const uuid = require("uuid").v4; // can be used to create a string on an upload for its filename so that theyre all unique

const upload = multer({
  storage: multer.diskStorage({
    destination: "product-data/images",
    filename: function (req, file, cb) {
      // takes the requst, the file, and the callback function
      cb(null, uuid() + "-" + file.originalname); // the process of adding the uuid to the filename
    },
  }),
});

const configuredMulterMiddleware = upload.single("image");

module.exports = configuredMulterMiddleware;
