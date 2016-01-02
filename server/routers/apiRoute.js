// api/ route
var apiController = require('../controllers/apiController');
var verifyUser = require('../middleware/middleware').verifyUser;
var getUserInfo = require('../middleware/middleware').getUserInfo;

module.exports = function (app) {
  app.get('/top10', apiController.topTen);
  app.get('/package/:packageName', getUserInfo, apiController.getPackage);
  app.post('/package/:id', verifyUser, apiController.addOrUpdateReview);
  app.get('/download/:id', apiController.downloadPackage);
  app.get('/users/:userName/packages', apiController.getUserPackages);
  app.post('/search', apiController.searchTerm); // NOTE: No need to verify user here
  app.post('/package/:packageName/edit', verifyUser, apiController.editPackage);
  app.get('/package/:packageName/edit', verifyUser, apiController.isUserPackage);
  app.delete('/package/:packageID/', verifyUser, apiController.deletePackage);
};
