angular.module('sher.job', ['ngResource', 'ui.bootstrap', 'ngAnimate', 'angular-table'])

.controller('JobCtrl', [
    '$scope',
    '$stateParams',
    '$interval',
    '$state',
    'JobManager',
function($scope, $stateParams, $interval, $state, JobManager) {
    $scope.query = $stateParams.query || "all";

    // 加载数据
    var reload = function (query) {
        JobManager.refresh().$promise.then(function(response) {
            $scope.jobs = JobManager.getJobs(query)
            $scope.healthyJobCount = JobManager.getJobs('healthy').length;
            $scope.unhealthyJobCount = JobManager.getJobs('unhealthy').length;
            $scope.jobCount = JobManager.getAllJobs().length;
        });
    }

    // 初次加载数据
    reload($scope.query);

    // 搜索任务
    $scope.search = function () {
        $state.go('navbar.job', {query: $scope.search_key})
    }

    // 表格行点击
    $scope.rowClick = function(taskID){
		$state.go('navbar.detail',{taskID: taskID});
	};

    // 加载任务, 定时监控
    var timer = $interval(function() {
        reload($scope.query);
    }, 1000);

    // 离开页面时删除计时器
    $scope.$on("$destroy", function(event) {
        $interval.cancel(timer);
    })        
}]);


