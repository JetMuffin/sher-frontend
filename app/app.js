'use strict';

// Declare app level module which depends on views, and components
angular.module('sher', [
  'ui.router',
  'sher.task',
  'sher.view2',
]).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/task');

  $stateProvider
      .state("task", {
        url: "/task?state",
        templateUrl: "task/task.html",
        controller: 'TaskCtrl'
      });
}]);
