(function() {
  'use strict';

  angular
    .module('sherFrontend')
    .controller('DashboardHealthController', DashboardHealthController)
    .controller('DashboardJobController', DashboardJobController)
    .controller('DashboardTaskController', DashboardTaskController);

  /** @ngInject */
  function DashboardHealthController($scope, $interval, taskManager) {
    var totalPoints = 60;

    var reload = function() {
      taskManager.systemUsage(function(response) {
        $scope.cpu.data = shiftAndPush($scope.cpu.data, response.message.used_cpus, response.message.free_cpus);;
        $scope.mem.data = shiftAndPush($scope.mem.data, response.message.used_mem, response.message.free_mem);;
        $scope.disk.data = shiftAndPush($scope.disk.data, response.message.used_disk, response.message.free_disk);;
      });
    }

    $scope.cpu = {
      data: emptyArray(totalPoints),
      options: {
          max: 100,
          min: 0,
          stroke: "#9048d6",
          strokeWidth: 2,
          fill: "#3d365e",
          width: "100%",
          height: "140px",
      }
    };

    $scope.mem = {
      data: emptyArray(totalPoints),
        options: {
            max: 100,
            min: 0,
            stroke: "#8b54d7",
            strokeWidth: 2,
            fill: "#3d365e",
            width: "100%",
            height: "60px",
        }
    };
    $scope.disk = {
      data: emptyArray(totalPoints),
        options: {
            max: 100,
            min: 0,
            stroke: "#8b54d7",
            strokeWidth: 2,
            fill: "#3d365e",
            width: "100%",
            height: "60px",
        }
    };       
    reload()

    // 加载任务, 定时监控
    var timer = $interval(function() {
        reload();
    }, 1000);

    // 离开页面时删除计时器
    $scope.$on("$destroy", function(event) {
        $interval.cancel(timer);
    })  
  }

  function DashboardJobController ($scope, $interval, $state, jobManager) {
      var reload = function () {
          jobManager.refresh().$promise.then(function(response) {
              $scope.jobs = {
                  total: jobManager.getJobsByStatus('all'),
                  running: jobManager.getJobsByStatus('running'),
                  finished: jobManager.getJobsByStatus('finished'),
                  failed: jobManager.getJobsByStatus('failed')
              }

              $scope.job = {
                  data: [$scope.jobs.running.length, $scope.jobs.finished.length, $scope.jobs.failed.length],
                  options: {
                      fill: ["#33c87e", "#8b8f9a", "#f94965"],
                      radius: 30,
                      innerRadius: 27,
                  }
              }        
          });
      }
      $scope.job = {
          data: [0, 0, 0],
          options: {
              fill: ["#33c87e", "#8b8f9a", "#f94965"],
              radius: 30,
              innerRadius: 27,
          }
      }       
      reload()

      // 加载任务, 定时监控
      var timer = $interval(function() {
          reload();
      }, 1000);

      // 离开页面时删除计时器
      $scope.$on("$destroy", function(event) {
          $interval.cancel(timer);
      })  
  }

  function DashboardTaskController ($scope, $interval, $state, taskManager) {
      $scope.tasks = {
          running: 0,
          waiting: 0,
          waitTimeLastMinite: 0,
          waitTimeUnit: "ms",
          failureRatePercent: 0                
      }
      var reload = function () {
          taskManager.refresh().$promise.then(function(response) {
              $scope.tasks = {
                  running: taskManager.getTasks('running').length,
                  waiting: taskManager.getTasks('waiting').length,
                  waitTimeLastMinite: 23.6,
                  waitTimeUnit: "ms",
                  failureRatePercent: 12                
              }

              $scope.overview = {
                  data: [$scope.tasks.waiting, $scope.tasks.running],
                  options: {
                      fill: ["#fac543", "#33c87e"],
                      radius: 75,
                      innerRadius: 71,            
                  }
              }     
          });

          taskManager.systemMetric(function (response) {
              $scope.waitTime.data = []
              response.message.wait_time.forEach(function (metric) {
                  $scope.waitTime.data.push(metric.value/1000000000)
              })
              $scope.failRate.data = []
              response.message.failure_rate.forEach(function (metric) {
                  $scope.failRate.data.push(metric.value)
              })            
          })
      }    


      $scope.overview = {
          data: [0, 0],
          options: {
              fill: ["#fac543", "#33c87e"],
              radius: 75,
              innerRadius: 71,            
          }
      }
      $scope.waitTime = {
          data: emptyArray(60),
          options: {
              stroke: "#f7c543",
              strokeWidth: 2,
              fill: ["#f7c543"],
              width: "100%",
              height: "120px",
          }
      }
      $scope.failRate = {
          data: emptyArray(60),
          options: {
              max: 100,
              min: 0,
              stroke: "#f74a66",
              strokeWidth: 2,
              fill: ["#f74a66"],
              width: "100%",
              height: "120px",
          }
      }    
      
      reload();

      // 加载任务, 定时监控
      var timer = $interval(function() {
          reload();
      }, 1000);

      // 离开页面时删除计时器
      $scope.$on("$destroy", function(event) {
          $interval.cancel(timer);
      })      
  }

  function isZeroArray(array) {
    for(var i = 0; i < array.length; i++) {
      if(array[i] != 0) {
        return false;
      }
    }
    return true;
  }

  function emptyArray(size) {
    var data = [];
    while (data.length < size) {
        data.push(0);
    }
    return data;
  }

  function shiftAndPush(arr, used, free) {
    arr.shift();
    arr.push(used/(used+free)*100);
    return arr;
  }

})();
