function protectRoutes(req, res, next) {
  if (!res.locals.isAuth) {
    return res.redirect("/401"); // 401 is unauthorized
  }

  if (req.path.startsWith("admin") && !res.locals.isAdmin) {
    // startsWith is a built in string function. the req.path value is itself a string ("/admin/thing/whatever") and it's checking if it starts with admin, and also whether or not the logged in user is an admin or not
    return res.redirect("/403"); // 403 is forbidden, ie when you have valid credentials but not the specific privileges for a given role.
  }

  next(); // if user passes both validation checks, goes next, ie onto the next middlewares.
}

module.exports = protectRoutes;
