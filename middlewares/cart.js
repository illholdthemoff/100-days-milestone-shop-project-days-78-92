const Cart = require("../models/cart.model");

function initializeCart(req, res, next) {
  let cart;

  if (!req.session.cart) {
    cart = new Cart();
  } else {
    cart = new Cart(req.session.cart.items); // if the cart 'exists' already, basically adds all of its items to it. We do this because while we save what's in the cart, we don't save any of the methods or whatever, so we gotta do this as a bit of a workaround
  }

  res.locals.cart = cart;

  next();
}

module.exports = initializeCart;
