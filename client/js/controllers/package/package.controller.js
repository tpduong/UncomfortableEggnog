(function () {
  'use strict';
  angular.module('app')
    .controller('PackageCtrl', PackageCtrl);

  PackageCtrl.$inject = ["ApiFactory", "$state"];

  function PackageCtrl (ApiFactory, $state) {
    var self = this;
    var packageName = $state.params.packageName;
    var get = ApiFactory.get;
    self.hello = packageName;
    self.user;
    var init = function () {
      get('/api/package/' + packageName)
      .then(function (data) {
        if (data === "Not Found") {
          $state.go('main');
        }
        self.info = data.package;
        self.user = data.user;
          self.user.prevReview = data.prevReview || null;
          // self.user.ownPackage = data.ownPackage || false;
        if (self.user.username === localStorage.username) {
          self.user.canEditPackage = true;
        }
      });
    };

    init();
  }
})();
