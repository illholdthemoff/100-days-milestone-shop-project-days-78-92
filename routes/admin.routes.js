const express = require("express");

const adminController = require("../controllers/admin.controller");
const imageUploadMiddleware = require("../middlewares/image-upload");

const router = express.Router();

router.get("/products", adminController.getProducts); // admin/products, getting the products page when admin controller calls getProducts

router.get("/products/new", adminController.getNewProduct); // ditto, but for getNewProduct

router.post(
  "/products",
  imageUploadMiddleware,
  adminController.createNewProduct
); // this works because you can add multiple middlewares before using the controller at the end

router.get("/products/:id", adminController.getUpdateProduct); // gets a product based on its id

router.post(
  "/products/:id",
  imageUploadMiddleware,
  adminController.updateProduct
); // imageuploadmiddleware is needed sicne this is posting with the image in mind, even if its not used. Otherwise it will delete everything in the field but the image. the :id there indicates that it does this with the product with a matching id

router.delete("/products/:id", adminController.deleteProduct); // buhleets the current item

router.get("/orders", adminController.getOrders); // gets all orders

router.patch("/orders/:id", adminController.updateOrder); // updates the current order id

module.exports = router;
