(function () {
  'use strict';
  angular.module('app')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['ApiFactory', "$state", '$timeout'];

  function LoginCtrl (ApiFactory, $state, $timeout) {
    var self = this;
    self.post = function () {
      ApiFactory.post('/login', {
        username: self.username,
        password: self.password
      }).then(function (result) {
        self.errorMessage = '';
        self.username = '';
        self.password = '';
        if (result.error) {
          self.errorMessage = result.error;
          self.hasError = true;
          $timeout(function () {
            self.hasError = false;
          }, 2000);
          console.log('error: ', result.error);
          // $state.go('login');
        } else if (result.token) {
          // result has the token and the userName and stores it in localstorage
          localStorage.setItem('token', result.token);
          localStorage.setItem('username', result.username);
          $state.go('user', {userName: result.username});
        }
      });
    };
  }
})();
