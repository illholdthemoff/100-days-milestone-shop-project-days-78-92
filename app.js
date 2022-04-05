const express = require("express");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(authRoutes); // makes sure that this middleware is used for eveyr valid incoming request

app.listen(3000);
