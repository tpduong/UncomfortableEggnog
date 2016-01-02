(function () {
  'use strict';
  angular.module('app')
    .controller('EditPackageCtrl', EditPackageCtrl);

  EditPackageCtrl.$inject = ['ApiFactory', '$state'];

  function EditPackageCtrl (ApiFactory, $state) {
    var self = this;
    self.package = {};
    self.fields = {
      originalTitle: '',
      title: '',
      description: '',
      commands: [],
      command: '',
      action: '',
      errorList: []
    };

    self.errorMessages = {
      title: 'Please only use letters, numbers, and spaces.',
      titleLength: "Title is limited to 15 characters.",
      description: 'Description is limited to 100 characters.',
      command: 'Please only use letters, numbers, and spaces.',
      variable: "Please format variable as follow: \<ARG del='+' quote=true case='proper'\>",
      del: "Delimiter(del) can only have 5 or fewer characters of: space, '+', '-', '_', '*', '.'",
      cap: "Cap can either be 'upper', 'lower', or 'proper'.",
      quote: "Quote can either have true or false boolean values.",
      dup: "You already have that command.",
      validCommand: "Please add a valid command/action.",
      validDescription: "Please enter a valid description.",
      validTitle: "Please enter a valid title."
    };

    self.isInputInvalid = function (input) {
      return input.$dirty && input.$invalid;
    };

    self.isInputValid = function (input) {
      return input.$dirty && input.$valid;
    };

    self.setPristine = function (field) {
      if (field.$$lastCommittedViewValue === '') {
        field.$setPristine();
      }
    };

    self.validateAndPost = function () {
      var validated = true;
      self.fields.errorList = [];
      if (!self.fields.title) {
        self.fields.errorList.push(self.errorMessages.validTitle);
        validated = false;
      }
      if (self.fields.commands.length < 1) {
        self.fields.errorList.push(self.errorMessages.validCommand);
        validated = false;
      }
      if (!self.fields.description) {
        self.fields.errorList.push(self.errorMessages.validDescription);
        validated = false;
      }
      if (validated) {
        self.postEdit();
      }
    };

self.actionValidation = function (action) {
      var substring = "<ARG";
      var allowedDel = " _-*%+";
      //check if action is an ARG
      if (action.indexOf(substring) > -1) {
        var _argSyntax = /<ARG\s*[a-zA-Z0-9+='"_\s\\\/%]*\/>/g;

        var arg_re = new RegExp(_argSyntax);
        var match = action.match(arg_re);

        if (!match || action.match(/<ARG/g).length !== match.length) {
          //show variable error
          self.fields.errorList.push(self.errorMessages.variable, self.errorMessages.del, self.errorMessages.cap, self.errorMessages.quote);
          return false;
        }
      }
      return true;
    };

    self.addCommand = function () {
      self.fields.errorList = [];
      // show error if duplicate command
      for (var i = 0; i < self.fields.commands.length; i++) {
        if (self.fields.commands[i].command === self.command) {
          self.fields.errorList.push(self.errorMessages.dup);
          return;
        }
      }
      if (!self.command || !self.action) {
        self.fields.errorList.push(self.errorMessages.validCommand);
      } else if (self.actionValidation(self.action)) {
        self.fields.commands.push({
          command: self.command,
          action: self.action
        });
        self.command = '';
        self.action = '';
      }
    };

    self.removeCommand = function (commandToRemove) {
      for (var i = 0; i < self.fields.commands.length; i++) {
        if (self.fields.commands[i].command === commandToRemove) {
          self.command = commandToRemove;
          self.action = self.fields.commands[i].action;
          self.fields.commands.splice(i, 1);
          return;
        }
      }
    };

    // makes a get request to the edit route of the package
    ApiFactory.get('/api/package/' + $state.params.packageName + '/edit')
      .then(function (result) {
        // Server side, we check to see that the user and the package match
        if (result.error) {
          // if error, we go to the package page, no editing allowed
          $state.go('package', {packageName: $state.params.packageName});
        } else {
          // else we set self.package to the returned obj
          self.package = result[0];
          self.fields.originalTitle = result[0].title;
          self.fields.title = result[0].title;
          self.fields.description = result[0].description;

          // We build our commands array by iterating over the packageContents
          for (var key in result[0].packageContents) {
            self.fields.commands.push({
              command: key,
              action: result[0].packageContents[key]
            });
          }
        }
      });

    self.postEdit = function () {
      self.package.packageContents = {};
      for (var i = 0; i < self.fields.commands.length; i++) {
        self.package.packageContents[self.fields.commands[i].command] = self.fields.commands[i].action;
      }

      self.package.title = self.fields.title;
      self.package.description = self.fields.description;

      ApiFactory.post('/api/package/' + $state.params.packageName + '/edit', self.package).then(function (r) {
        $state.go('user', {userName: localStorage.username});
      });
    };

    self.deletePackage = function () {
      ApiFactory.apiDelete('/api/package/' + self.package._id)
        .then(function (data) {
          $state.go('user', {userName: localStorage.username});
      });
    };
  }
})();
