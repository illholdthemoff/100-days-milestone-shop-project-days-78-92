function createUserSession(req, user, action) {
  req.session.uid = user._id.toString(); // ._id is the mongoDB key for id. We are turning it into a string because by default ._id is an object
  req.session.save(action);
}

function destroyUserAuthSession(req) {
  req.session.uid = null;
  // req.session.save // not necessary, since the above will save it automatically since it has been changed.
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession,
};
