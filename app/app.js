'use strict';

// Declare app level module which depends on views, and components
angular.module('sher', [
  'ngRoute',
  'sher.task',
  'sher.view2',
  'sher.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/task'});
}]);
