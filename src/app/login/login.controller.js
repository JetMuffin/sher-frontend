(function() {
  'use strict';

  angular
    .module('sherFrontend')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($scope, $rootScope, $state, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();

        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $state.go('navbar.dashboard');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };
  }
})();
