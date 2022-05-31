async function updateCartPrices(req, res, next) {
  const cart = res.locals.cart; // getting the cart from res.locals

  await cart.updatePrices(); // calling the updateprices from cart.model

  //req.session.cart = cart;
  next();
}

module.exports = updateCartPrices;
