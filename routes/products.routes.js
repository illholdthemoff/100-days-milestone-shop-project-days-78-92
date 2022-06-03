const express = require("express");

const productsController = require("../controllers/products.controller");

const router = express.Router();

router.get("/products", productsController.getAllProducts);

router.get("/products/:id", productsController.getProductDetails); // details of a specific product

module.exports = router;
