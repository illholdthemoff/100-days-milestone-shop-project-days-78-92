const express = require("express");

const cartController = require("../controllers/cart.controller");

const router = express.Router();

router.get("/", cartController.getCart); // effectively /cart/ due to our filter.

router.post("/items", cartController.addCartItem); // /cart/items

module.exports = router;
