const Product = require("../models/product.model");

function getCart(req, res) {
  res.render("customer/cart/cart");
}

async function addCartItem(req, res, next) {
  let product; // this is a let and out here so that we can throw it in res.locals.cart. Otherwise product below would be a const and not be up here, thus just be scoped to the try block.
  try {
    product = await Product.findById(req.body.productId); // psot request, since we are posting data to the server (as in adding etc, so we grab from the body which we cannot do with a get request)
  } catch (error) {
    next(error);
    return;
  }

  const cart = res.locals.cart;

  cart.addItem(product);
  req.session.cart = cart; // saves the changes we made here to the session cart.
  // req.session.save(); // unneeded since the above already saves it, and is not needed unless we redirect or another action that requires the data to be updated.

  res.status(201).json({
    message: "Cart updated!",
    newTotalItems: cart.totalQuantity,
  }); // code 201 indicates that setting the data succeeded.
}

function updateCartItem(req, res) {
  const cart = res.locals.cart;

  const updatedItemData = cart.updateItem(
    req.body.productId,
    +req.body.quantity
  );

  req.session.cart = cart;

  res.json({
    message: "Item updated!",
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData.updatedItemPrice,
    },
  });
}

module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
  updateCartItem: updateCartItem,
};
