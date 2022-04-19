function checkAuthStatus(req, res, next) {
  const uid = req.session.uid; // grabs the ._uid that was toString'd earlier

  if (!uid) {
    return next(); // returning next so that the app doesnt crash or stop
  }

  res.locals.uid = uid; // sets the uid
  res.locals.isAuth = true; //authenticates user
  res.locals.isAdmin = req.session.isAdmin; // allowing locals to grab isadmin from the session by assigning it
  next();
}

module.exports = checkAuthStatus;
