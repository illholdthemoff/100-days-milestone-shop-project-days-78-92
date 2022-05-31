function handleErrors(error, req, res, next) {
  console.log(error); // grabs whatever the error is and logs it in the console

  if (error.code === 404) {
    return res.status(404).render("shared/404"); // set status code to 404 and render the 404 page
  }

  res.status(500).render("shared/500"); // set status code to 500 and renders the 500 page
}

module.exports = handleErrors;
