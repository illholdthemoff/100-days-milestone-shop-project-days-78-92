const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      fullname: "",
      street: "",
      postal: "",
      city: "",
    };
  }

  res.render("customer/auth/signup", { inputData: sessionData });
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "please check your input.",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );

    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "User exists already!",
          ...enteredData,
        },
        function () {
          res.redirect("/signup"); // redirects if the user email is already in the database
        }
      );

      return;
    }

    await user.signup();
  } catch (error) {
    next(error); // since error handling doesnt work with promises/async by default, we must do this, try catch and then enter the error in the event it fails
    return;
  }

  res.redirect("/login");
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }

  res.render("customer/auth/login", { inputData: sessionData });
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password); // just grabbing the email and password, since to identify a unique user this is all we need.
  let existingUser; // setting this up as a let since it can be used in two different places below

  try {
    existingUser = await user.getUserWithsameEmail(); // true if it returns a user that already exists
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage: "Invalid credentials!",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    // if the user does not already exist, redirect and return, stopping further execution below
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });

    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  ); // checks if entered user password matches that against the database, using the user's entered password vs the database's hashed one.

  if (!passwordIsCorrect) {
    // if passwords don't match (wrong), redirects and returns
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
