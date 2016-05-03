(function() {
  'use strict';

  angular
    .module('sherFrontend')
    .controller('TaskDetailController', TaskDetailController)
    .controller('TaskDetailCpuController', TaskDetailCpuController)
    .controller('TaskDetailMemController', TaskDetailMemController)
    .controller('TaskDetailLogController', TaskDetailLogController)
    .controller('TaskDetailOutputController', TaskDetailOutputController);

  /** @ngInject */
  function TaskDetailController($scope, $http, $stateParams, taskManager, $uibModal, $state, $interval, toastr){
      // 加载数据
      var reload = function (query) {
        taskManager.refresh().$promise.then(function(response) {
          $scope.task = taskManager.getById($stateParams.taskID);
          $scope.refresh_random = Math.random();
        });
      }   

      reload();
      
    // 定时刷新任务列表
    var timer = $interval(function() {
      reload();
    }, 3000);

    // 离开页面时删除计时器
    $scope.$on("$destroy", function(event) {
      $interval.cancel(timer);
    })
  }

  /** @ngInject */
  function TaskDetailCpuController($scope, $http, taskManager) {
    var watcher = $scope.$watch('refresh_random', function(){
      if($scope.task) {
        var data = [];
        var time = [];
        if($scope.task.cpu_usage) {
          for (var i = 1; i < $scope.task.cpu_usage.length; i++) {
            var cur = $scope.task.cpu_usage[i];
            var prev = $scope.task.cpu_usage[i - 1];
            var intervalInNs = getInterval(cur.timestamp, prev.timestamp);

            time.push(getTimeScale(new Date(cur.timestamp)));
            data.push((cur.total - prev.total) / intervalInNs);
          }
          $scope.labels = time;
          $scope.series = ['cpu usage(cores)'];
          $scope.data = new Array();
          $scope.data.push(data);
        } else {
          $scope.nodata = true;
        }
      } 
    }); 

      $scope.options = {
        animation: false,
        pointDot: false,
        datasetStrokeWidth: 2,
      };
      $scope.colours = ['#9048d6', '#3d365e',];

      // 离开页面时释放监听
      $scope.$on("$destroy", function(event) {
        watcher();
      })       
  }

  /** @ngInject */
  function TaskDetailMemController($scope, $http) {
    var oneMegabyte = 1024 * 1024;
    var oneGigabyte = 1024 * oneMegabyte; 
    var watcher = $scope.$watch('refresh_random', function(){
      if($scope.task) {
        var data = [];
        var time = [];
        if($scope.task.memory_usage) {
          for (var i = 0; i < $scope.task.memory_usage.length; i++) {
            var cur = $scope.task.memory_usage[i];
            time.push(getTimeScale(new Date(cur.timestamp)));
            data.push(cur.total / oneMegabyte);
          }
          $scope.labels = time;
          $scope.series = ['memory usage (MB)'];
          $scope.data = new Array();
          $scope.data.push(data);
        } else {
          $scope.nodata = true;
        }
      }
    });

      $scope.options = {
        animation: false,
        pointDot: false,
        datasetStrokeWidth: 2,
        backgroundColor: "#fff",
      };
      $scope.colours = ['#f6478f', '#c64079',];


      // 离开页面时释放监听
      $scope.$on("$destroy", function(event) {
        watcher();
      })   
  }

  /** @ngInject */
  function TaskDetailLogController($scope, $stateParams, taskManager) {
      var reload = function (query) {
          taskManager.getTaskFile($stateParams.taskID, 'stderr', function(response){
              $scope.logs = response.message.split('\n');
          });
      }   
      reload();
  }


  /** @ngInject */
  function TaskDetailOutputController ($scope, $stateParams, taskManager) {
      var reload = function (query) {
          taskManager.getTaskFile($stateParams.taskID, 'stdout', function(response){
              $scope.output = response.message.split('\n');
          });
      } 

      reload();
  }


  function getInterval(current, previous) {
    var cur = new Date(current);
    var prev = new Date(previous);

    // ms -> ns.
    return (cur.getTime() - prev.getTime()) * 1000000;
  }

  function getTimeScale(now) {
    var hour = fillWithPrefixZero(now.getHours()); 
    var minute = fillWithPrefixZero(now.getMinutes()); 
    var second = fillWithPrefixZero(now.getSeconds()); 
    return hour + ":" + minute + ":" + second;
  }

  function fillWithPrefixZero(num) {
    if(num < 10) {
      return '0' + num;
    } else {
      return num;
    }
  }

})();
