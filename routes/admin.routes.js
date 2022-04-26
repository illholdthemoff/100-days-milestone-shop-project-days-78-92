const express = require("express");

const adminController = require("../controllers/admin.controller");
const imageUploadMiddleware = require("../middlewares/image-upload");

const router = express.Router();

router.get("/products", adminController.getProducts); // admin/products

router.get("/products/new", adminController.getNewProduct);

router.post(
  "/products",
  imageUploadMiddleware,
  adminController.createNewProduct
); // this works because you can add multiple middlewares before using the controller at the end

router.get("/products/:id", adminController.getUpdateProduct);

router.post(
  "/products/:id",
  imageUploadMiddleware,
  adminController.updateProduct
); // imageuploadmiddleware is needed sicne this is posting with the image in mind, even if its not used. Otherwise it will delete everything in the field but the image.

module.exports = router;
