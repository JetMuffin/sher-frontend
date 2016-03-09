/**
 * Created by jeff on 16/3/9.
 */

var FILTER_NAME = ['All', 'Running', 'Finished', 'Failed', 'Killed', 'Lost', 'Staging', 'Error'];

angular.module('sher.task', ['ngResource'])

.controller('TaskCtrl', ['$scope', '$http', '$timeout', '$stateParams', 'Tasks', function($scope, $http, $timeout, $stateParams, Tasks) {
    $scope.state = $stateParams.state || "0";
    $scope.filter = FILTER_NAME[parseInt($scope.state)];

    // 加载数据
    var reload = function (state) {
        Tasks.refresh().$promise.then(function(response) {
            //TODO 错误处理
            $scope.tasks = Tasks.getTasks(state)
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

    // 提交任务
    $scope.submitTask = function (task) {
        Tasks.submitTask(task, reload($scope.state))
    }

    // 杀死任务
    $scope.killTask = function (task) {
        //TODO
    }

    // 删除任务
    $scope.deleteTask = function (task) {
        //TODO
    }


    reload($scope.state);
    //setInterval(function(){
    //    Tasks.monitor(reload($scope.state))
    //},1000)
}])