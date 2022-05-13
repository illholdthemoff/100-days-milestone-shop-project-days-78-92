const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");
const updateCartPricesMiddleware = require("./middlewares/update-cart-prices");
const notFoundMiddleware = require("./middlewares/not-found");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/products.routes");
const baseRoutes = require("./routes/base.routes");
const checkAuthStatus = require("./middlewares/check-auth");
const adminRoutes = require("./routes/admin.routes");
const protectRoutes = require("./middlewares/protect-routes");
const cartRoutes = require("./routes/cart.routes");
const ordersRoutes = require("./routes/orders.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // done so that we can check all incoming requests for json data.

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware); // using after the session so that it will work, as it grabs info from the session

app.use(baseRoutes);
app.use(authRoutes); // makes sure that this middleware is used for eveyr valid incoming request
app.use(productRoutes);
app.use("/cart", cartRoutes); // filter, so that only routes that begin with /cart will go here.
//app.use(protectRoutesMiddleware); // goalkeeps people from entering into routes where they arent supposed to by checking their authentication against 2 checks. 1. whether they are authorized ie logged in, and 2, whether they are admin or not, getting increased access with each pass. CHANGED IN ORDER TO ACCOMODATE notFoundMiddleware!!!
app.use("/orders", protectRoutesMiddleware, ordersRoutes);
app.use("/admin", protectRoutesMiddleware, adminRoutes); // filter, so that only routs that begin with /admin will make it in ehre
//protectRoutesMiddleware added within here due to the below notFoundMiddleware. Remember multiple middlewares can be added, which are then executed left to right!

app.use(notFoundMiddleware); // covers all other routes IE ones taht don't exist

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect to database!");
    console.log(error);
  });
