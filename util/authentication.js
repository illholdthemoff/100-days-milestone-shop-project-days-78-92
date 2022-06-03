function createUserSession(req, user, action) {
  req.session.uid = user._id.toString(); // ._id is the mongoDB key for id. We are turning it into a string because by default ._id is an object
  req.session.isAdmin = user.isAdmin; // grabbing the value isAdmin from the session, for the purpose of checking whether or not a given user has admin privileges or not.
  req.session.save(action);
}

function destroyUserAuthSession(req) {
  req.session.uid = null; // kills current user session
  // req.session.save // not necessary, since the above will save it automatically since it has been changed.
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession,
};
