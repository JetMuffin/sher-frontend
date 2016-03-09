/**
 * Created by jeff on 16/3/9.
 */

var FILTER_NAME = ['All', 'Running', 'Finished', 'Failed', 'Killed', 'Lost', 'Staging', 'Error'];

angular.module('sher.task', ['ngResource', 'ui.bootstrap'])

.controller('TaskCtrl', [
    '$scope',
    '$http',
    '$timeout',
    '$stateParams',
    '$uibModal',
    'Tasks',
function($scope, $http, $timeout, $stateParams, $uibModal, Tasks) {
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

    // 打开提交任务的模态框
    $scope.openTaskModal = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'task/task.modal.html',
            controller: TaskModalCtrl,
            size: 'md',
            resolve: {

            }
        });
    }

    // 模块对话框控制器
    var TaskModalCtrl = function ($scope, $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };

    reload($scope.state);
    //setInterval(function(){
    //    Tasks.monitor(reload($scope.state))
    //},1000)
}]);


