function addCsrfToken(req, res, next) {
  res.locals.csrfToken = req.csrfToken(); // grabs the csrfToken and assigns it to locals so we can grab it elsewhere.
  next();
}

module.exports = addCsrfToken;
