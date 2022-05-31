const Cart = require("../models/cart.model");

function initializeCart(req, res, next) { // obviously initializes a new cart.
  let cart; // set as a let so we can make changes to it later.

  if (!req.session.cart) { // checks if cart does not already exist, and if not...
    cart = new Cart(); // instantiates a new cart.
  } else {
    const sessionCart = req.session.cart; // grabs the session's cart so we can add it/its contents to the actual Cart constructor
    cart = new Cart(
      sessionCart.items,
      sessionCart.totalQuantity,
      sessionCart.totalPrice
    ); // if the cart 'exists' already, basically adds all of its items to it. We do this because while we save what's in the cart, we don't save any of the methods or whatever, so we gotta do this as a bit of a workaround
  }

  res.locals.cart = cart; // res.locals so it can be accessed anywhere in the project that its needed.
  //refresher: res.locals in an express.js thing that contains local variables for the response which are scoped to only that request and therefore only available there.

  next(); // continues onto whatever the next thing is in the line.
}

module.exports = initializeCart;
