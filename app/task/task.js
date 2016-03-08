'use strict';

var API = "http://192.168.33.1:3030/api";

angular.module('sher.task', ['ngRoute', 'ngResource'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/task', {
    templateUrl: 'task/task.html',
    controller: 'TaskCtrl'
  });
}])

.controller('TaskCtrl', ['$scope', '$http', '$timeout', 'Tasks', function($scope, $http, $timeout, Tasks) {
  // 加载数据
  var reload = function () {
    Tasks.refresh().$promise.then(function(response) {
      //TODO 错误处理
      $scope.tasks = Tasks.getAllTasks()
      console.log("reload")
      console.log($scope.tasks)
    });
  }

  // 监听任务
  var monitor = function() {
    $http({
      method: 'GET',
      url: API + '/system/metrics',
    }).success(function(response) {
      reload();
    });
  }

  // 数据初始化
  $scope.task = {
    cpus:'0.1',
    mem:'32',
    disk:'0',
    docker_image:'busybox',
    cmd:'ls',
    volumes: [
      {
        container_path: "/data",
        host_path: "/vagrant",
        mode: "RW"
      }
    ],
    portMappings: [
      {
        container_port: "8000",
        host_port: "8080",
        protocol: "TCP"
      }
    ]
  }
  $scope.tasks = Tasks.getAllTasks();

  setInterval(function(){
    monitor()
  },1000)

  // 提交任务
  $scope.submitTask = function (task) {
    $http({
      method: 'POST',
      url: API + '/tasks',
      data : task,
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json; ; charset=UTF-8'
      }
    }).success(function(response) {
      reload();
    });
  }


}])


.factory('Tasks', ['$resource', '$http', function($resource, $http) {
  var tasks = [];
  var resource = $resource(API + '/tasks', {}, {
    query: {
      method: 'get',
      timeout: 20000
    },
  })

  var getTasks = function(callback) {
    return resource.query({

    }, function(r) {
      return callback && callback(r);
    })
  };

  return {
    refresh: function() {
      return getTasks(function(response) {
        tasks = response.result
        for(var i = 0; i < tasks.length; i++) {
          switch (parseInt(tasks[i].state)) {
            case 0:
              tasks[i].status="STARTING";
              tasks[i].label_class="info";
              break;
            case 1:
              tasks[i].status="RUNNING";
              tasks[i].label_class="info";
              break;
            case 2:
              console.log(1);
              tasks[i].status="FINISHED";
              tasks[i].label_class="success";
              break;
            case 3:
              tasks[i].status="FAILED";
              tasks[i].label_class="danger";
              break;
            case 4:
              tasks[i].status="KILLED";
              tasks[i].label_class="warning";
              break;
            case 5:
              tasks[i].status="LOST";
              tasks[i].label_class="default";
              break;
            case 6:
              tasks[i].status="STAGING";
              tasks[i].label_class="primary";
              break;
          }
        }
        tasks.sort(function(a, b) {
          return a.create_time - b.create_time;
        })
      })
    },
    resetData: function() {
      tasks = [];
    },
    getAllTasks: function() {
      return tasks;
    },
    getById: function(id) {
      if (!!tasks) {
        for (var i = 0; i < tasks.length; i++) {
          if (tasks[i].id === id) {
            return tasks[i];
          }
        }
      } else {
        return null;
      }
    }
  }
}])