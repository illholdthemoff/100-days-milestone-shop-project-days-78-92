async function updateCartPrices(req, res, next) {
  const cart = res.locals.cart; // getting the cart from the session(?)

  await cart.updatePrices();

  //req.session.cart = cart;
  next();
}

module.exports = updateCartPrices;
