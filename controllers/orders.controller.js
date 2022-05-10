const Order = require("../models/order.model");
const User = require("../models/user.model"); // so we can grab data from the user

function getOrders(req, res) {
  res.render("customer/orders/all-orders");
}

async function addOrder(req, res) {
  const cart = res.locals.cart; // grabs access to the cart so we can submit whatevers in it

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument); // adding the order class in here so that we can submit things from the cart, adding in the cart as well as some data from the user for shipping porpoises.

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null; // empties the cart, as the order was submitted.

  res.redirect("/orders");
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
};
