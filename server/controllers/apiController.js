var helpers = require('../helpers/helpers');
var rootFolder = require('../../rootPath');
var Promise = require('bluebird');
var utils = require('../lib/utils');

module.exports.topTen = function (req, res) {
  helpers.findPackageEntries(function (err, entries) {
    if (err) {
      res.redirect('/');
    } else {
      res.json(entries);
    }
  });
};

module.exports.searchTerm = function (req, res) {
  helpers.searchPackages(req.body.searchTerm, function (err, entries) {
    if (err) {
      res.redirect('/');
    } else {
      res.json(entries);
    }
  });
};

// TODO: this may be a duplicate function.

module.exports.getPackage = function (req, res) {
  var title = req.params.packageName;
  helpers.findPackageByTitle(title, function (err, entry) {
    if (err || !entry.length) {
      res.send(404);
    } else {
      helpers.findUserById(entry[0].userId, function (err, user) {
        if (err) {
          res.redirect('/');
        } else {
          var sendObj = {};
          sendObj.package = entry[0];
          sendObj.user = {
            // userId: user._id,
            username: user.username,
            email: user.email,
            website: user.website
          };

          //check to see and return previous review if exists
          for (var i = 0; i < sendObj.package.reviews.length; i++) {
            if (JSON.stringify(sendObj.package.reviews[i].userId) ===
              JSON.stringify(req.user._id)) {
              sendObj.prevReview = sendObj.package.reviews[i];
              break;
            }
          }
          res.json(sendObj);
        }
      });
    }
  });
};


// gets a username in the params, then we return out the packages associated
// to the username

module.exports.getUserPackages = function (req, res) {
  var name = req.params.userName;
  helpers.findPackagesByUsername(name, function (err, packages) {
    if (err) {
      res.redirect('/');
    } else {
      res.json(packages);
    }
  });
};

// Takes the userId and the package title
module.exports.isUserPackage = function (req, res) {
  var title = req.params.packageName;
  var userId = req.user._id;
  helpers.findPackageByTitle(title, function (err, entry) {
    // checks to see if theres an error or if the packages dont match
      // if no match, responds with error obj

    if (err || entry[0].userId.toString() !== userId) {
      res.json({error: true});
    } else {
      res.json(entry);
    }
  });
};

// passes req to editPackage, where it will check user obj against
// the package before updating db
module.exports.editPackage = function (req, res) {
  helpers.editPackage(req, function (err, packageEntry) {
    if (err) {
      res.redirect('/');
    } else {
      res.json(packageEntry);
    }
  });
};

module.exports.deletePackage = function (req, res) {
  helpers.deletePackage(req.params.packageID, function (err, success) {
    if (err) {
      res.redirect('/');
    } else {
      res.json("Package deleted.");
    }
  });
};

module.exports.addOrUpdateReview = function (req, res) {

  var review = {};

  var id = req.params.id;

  review.stars = req.body.stars;
  review.stars = typeof review.stars !== 'number' ? 0 : review.stars;
  review.contents = req.body.contents;
  review.totalStars = req.body.totalStars;
  review.userId = req.user._id;
  review.username = req.user.username;
  var prevReview = req.body.prevReview || null;
  console.log('prev review?', prevReview);
  if (!prevReview) {
    helpers.addReview(id, review, function (err, packageEntry) {
      if (err) {
        res.redirect('/');
      } else {
        res.json(packageEntry);
      }
    });
  } else {
    helpers.updateReview(id, review, prevReview, function (err, packageEntry) {
      if (err) {
        console.log('error');
        res.redirect('/');
      } else {
        console.log('successfully updated', packageEntry);
        res.json(packageEntry);
      }
    });
  }
};

module.exports.downloadPackage = function (req, res, next) {
  console.log("download");
  var id = req.params.id;
  var folder = rootFolder + '/server/tmp/' + Date.now() + '/';
  helpers.findPackageById(id, function (packageEntry, err) {
    if (err) {
      res.redirect('/');
    } else {
      utils.writeSnippetFile(packageEntry[0], folder).then(function (file) {
        res.download(file.filePath, file.fileName, function (err) {
          utils.cleanFolder(folder);
          if (err) {
            res.redirect('/');
          } else {
            incrementDownloads(id);
          }
        });
      });
    }
  });
};

function incrementDownloads (id) {
  helpers.incrementPackageDownloads(id, function (packageEntry, err) {
    if (err) {
      console.log(err);
    }
  });
};
