const stripe = require("stripe");

const Order = require("../models/order.model");
const User = require("../models/user.model");

const stripeObj = stripe(
  "sk_test_51L3REDHLAsqlklk1zMfUfklA0VW3KwqkZNRFGP1heYbfAWA4Z1VQbFcdWUOOeNesS0dmMRlxbkupxNorZ3PPWf3Q00cTxVLROy"
);

async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;

  const session = await stripeObj.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: cart.items.map(function (item) {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.title,
          },
          unit_amount: +item.product.price.toFixed(2) * 100, // + in front to ensure that the resulting data is a number and not a string. Here we use unit_amount specifically because this avoids any possible decimal errors. Here we effectively enter in the price as cents as opposed to dollars+cents (500 cents instead of $5)
        },
        quantity: item.quantity,
      };
    }),
    mode: "payment",
    success_url: `http://localhost:3000/orders/success`, // these 2 URLS redirect the user depending on the success or failure of the transaction
    cancel_url: `http://localhost:3000/orders/cancel`,
  });
  res.redirect(303, session.url);

  // res.redirect("/orders");
}

function getSuccess(req, res) {
  res.render("customer/orders/success");
}

function getFailure(req, res) {
  res.render("customer/orders/failure");
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess: getSuccess,
  getFailure: getFailure,
};
