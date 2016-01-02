(function () {
  'use strict';
  angular.module('app')
    .controller('PackageCtrl', PackageCtrl);

  PackageCtrl.$inject = ["ApiFactory", "$state", "$scope", "$timeout", "PackageFactory"];

  function PackageCtrl (ApiFactory, $state, $scope, $timeout, PackageFactory) {
    var self = this;
    var packageName = $state.params.packageName;
    var get = ApiFactory.get;
    self.getRating;
    self.hello = packageName;
    self.user;
    self.msg = '';
    $scope.rated = false;

    var init = function () {
      get('/api/package/' + packageName)
      .then(function (data) {
        if (data === "Not Found") {
          $state.go('login');
        }
        // console.log(data);
        self.info = data.package;
        console.log(self.info);
        self.getRating = PackageFactory.getRating;
        if (data.user) {
          self.user = data.user;
          self.user.prevReview = data.prevReview || null;
          if (self.user.username === localStorage.username) {
            self.user.canEditPackage = true;
          }
        }
        $scope.$watch('rated', function (newValue, oldValue) {
          if (newValue) {
            init();
            $timeout(function () {
              $scope.rated = false;
            }, 3000);
          }
        });
      });
    };
    init();
  }
})();
