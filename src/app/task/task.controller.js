(function() {
  'use strict';

  angular
    .module('sherFrontend')
    .controller('TaskController', TaskController);

  /** @ngInject */
  function TaskController($scope, $http, $stateParams, jobManager, $uibModal, $state, $interval, taskManager){
    $scope.query = $stateParams.query || "all";
    $scope.filter = $scope.query
  
    // 加载数据
    var reload = function (query) {
        taskManager.refresh().$promise.then(function(response) {
            //TODO 错误处理
            $scope.tasks = taskManager.getTasks(query)
            console.log($scope.tasks)
        });
    }

    // 初次加载数据
    reload();

    // 搜索任务
    $scope.search = function () {
        $state.go('navbar.task', {query: $scope.search_key})
    }

    
    $scope.rowClick = function(taskID){
        console.log(taskID);
        $state.go('navbar.taskdetail',{taskID: taskID});
      };

    // // 加载任务, 定时监控
    // var timer = $interval(function() {
    //     reload($scope.query);
    // }, 1000);

    // // 离开页面时删除计时器
    // $scope.$on("$destroy", function(event) {
    //     $interval.cancel(timer);
    // })       
  }

  /** @ngInject */
  function JobDetailFileController($scope, $stateParams, taskManager) {
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
