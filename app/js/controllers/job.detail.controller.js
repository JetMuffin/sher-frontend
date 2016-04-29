'use strict';

var detail = angular.module('sher.job.detail',['ngMaterial', 'ngMessages', 'chart.js', 'ui.router', 'ngAnimate', 'toastr']);

detail.controller("JobDetailCtrl", [
	'$scope', 
	'$http', 
	'$stateParams', 
	'JobManager',
	'$uibModal', 
	"$state", 
	'$interval',
	'toastr',
	function($scope, $http, $stateParams, JobManager, $uibModal, $state, $interval, toastr){
	    // 加载数据
	    var reload = function (query) {
			JobManager.refresh().$promise.then(function(response) {
	            //TODO 错误处理
				$scope.job = JobManager.getById($stateParams.jobID);
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
]);

detail.controller("JobFileCtrl", function ($scope, $stateParams, TaskManager) {
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
});