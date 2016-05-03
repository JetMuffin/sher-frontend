(function() {
  'use strict';

  angular
    .module('sherFrontend')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("login", {
        url: "/login",
        templateUrl: "app/login/login.html",
        controller: 'LoginController'
      })
      .state("navbar", {
        templateUrl: "app/components/navbar/navbar.html",
      })
      .state('navbar.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: ''
      })
      .state('navbar.job', {
        url: '/jobs?query',
        templateUrl: 'app/job/job.html',
        controller: 'JobController'
      })
      .state('navbar.jobdetail', {
        url: "/job/:jobID",
        templateUrl: "app/job/job.detail.html",
        controller: ''
      })      
      .state('navbar.task', {
        url: '/tasks?query',
        templateUrl: 'app/task/task.html',
        controller: 'TaskController'
      })
      .state("navbar.taskdetail", {
        url: "/task/:taskID",
        templateUrl: "app/task/task.detail.html",
        controller: 'TaskDetailController'
      })
      .state("navbar.node", {
        url: "/node?query",
        templateUrl: "app/node/node.html",
        controller: 'NodeController',
      }).state("navbar.filesystem", {
        url: "/fs",
        templateUrl: "app/fs/fs.html",
        controller: 'FileSystemController',
      });

    $urlRouterProvider.otherwise('/login');
  }

})();
