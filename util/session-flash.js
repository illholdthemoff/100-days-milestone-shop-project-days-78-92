function getSessionData(req) {
  const sessionData = req.session.flashedData; // grabs the data that is entered into the fields

  req.session.flashedData = null; // then deletes it from the fields (note we still have access to the flashed data)

  return sessionData;
}

function flashDataToSession(req, data, action) {
  req.session.flashedData = data;
  req.session.save(action); // what this does, is that as soon as the session is saved, it will execute whatver action is placed within the parameters.
}

module.exports = {
  getSessionData: getSessionData,
  flashDataToSession: flashDataToSession,
};
