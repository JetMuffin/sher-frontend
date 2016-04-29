'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('sher', [
  'ui.router',
  'sher.task',
  'sher.task.detail',
  'sher.overview',
  'sher.auth',
  'sher.cluster',
  'sher.fs',
  'sher.job',
  'sher.job.detail',
  'ngRoute',
  'ngCookies',
])

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
	  .state("login", {
        url: "/login",
        templateUrl: "/app/js/templates/login.html",
        controller: 'LoginController'
      }).state("navbar", {
        templateUrl: "/app/js/templates/navbar.html",
      })
      .state("navbar.task", {
        url: "/task?query",
        templateUrl: "/app/js/templates/task.html",
        controller: 'TaskCtrl'
      }).state("navbar.taskdetail", {
        url: "/task/:taskID",
        templateUrl: "/app/js/templates/task.detail.html",
        controller: 'TaskDetailCtrl'
      }).state("navbar.overview", {
        url: "/overview",
        templateUrl: "/app/js/templates/overview.html",
        controller: '',
      }).state("navbar.job", {
        url: "/job?query",
        templateUrl: "/app/js/templates/job.html",
        controller: 'JobCtrl',
      }).state("navbar.jobdetail", {
        url: "/job/:jobID",
        templateUrl: "/app/js/templates/job.detail.html",
        controller: ''
      }).state("navbar.node", {
        url: "/node?query",
        templateUrl: "/app/js/templates/cluster.html",
        controller: 'ClusterCtrl',
      }).state("navbar.filesystem", {
        url: "/fs",
        templateUrl: "/app/js/templates/fs.html",
        controller: 'FileSystemCtrl',
      });
  //$locationProvider.html5Mode({enabled:true, requireBase:false});
  // $locationProvider.html5Mode({enabled:true});
  $urlRouterProvider.otherwise('/login');
}])


app.run(['$rootScope', '$state', '$cookieStore', '$http',
		function ($rootScope, $state, $cookieStore, $http) {
			// keep user logged in after page refresh
			$rootScope.globals = $cookieStore.get('globals') || {};
			if ($rootScope.globals.currentUser) {
				//    $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; 
			}

			$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
				// redirect to login page if not logged in
				if (toState.name !== 'login' && !$rootScope.globals.currentUser) {
					event.preventDefault(); 
					$state.go('login');
				}
			});
		}]);



