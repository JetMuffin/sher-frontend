(function() {
  'use strict';

  angular
    .module('sherFrontend')
    .controller('JobDetailController', JobDetailController)
    .controller('JobDetailFileController', JobDetailFileController);

  /** @ngInject */
  function JobDetailController($scope, $http, $stateParams, jobManager, $uibModal, $state, $interval, toastr){
      // 加载数据
      var reload = function (query) {
        jobManager.refresh().$promise.then(function(response) {
          $scope.job = jobManager.getById($stateParams.jobID);
          $scope.refresh_random = Math.random();
        });
      }   

      reload();

      $scope.rowClick = function(taskID) {
      $state.go('navbar.taskdetail',{taskID: taskID});
      }

      // 加载任务, 定时监控
      var timer = $interval(function() {
          reload($scope.query);
      }, 1000);

      // 离开页面时删除计时器
      $scope.$on("$destroy", function(event) {
          $interval.cancel(timer);
      })      
  }

  function JobDetailFileController($scope, $stateParams, jobManager) {
    var reload = function (query) {
      jobManager.refresh().$promise.then(function(response) {
        $scope.job = jobManager.getById($stateParams.jobID);
        $scope.currentPath = $scope.job.output_path.split("/");
        $scope.currentPath.shift();
        $scope.$broadcast("setCurrentPath", $scope.currentPath) 
      });
    }   

    reload();    
        
    $scope.$on("handshake", function() {
      reload();    
    })

    $scope.options = {
      breadcrumb: true,
      optionButton: false,
      showSizeForDirectories: true,
      allowedActions: {
          upload: true,
          rename: false,
          move: false,
          copy: false,
          edit: false,
          changePermissions: false,
          compress: false,
          compressChooseName: false,
          extract: false,
          download: true,
          downloadMultiple: true,
          preview: true,
          remove: true
      },      
    }
  }
})();
