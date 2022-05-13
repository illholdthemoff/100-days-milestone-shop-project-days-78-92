function notFoundHandler(req, res) {
  res.render("shared/404"); // renders a 404 page when things arent found.
}

module.exports = notFoundHandler;
