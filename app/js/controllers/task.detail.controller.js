'use strict';

var detail = angular.module('sher.task.detail',['ngMessages', 'chart.js', 'ui.router', 'ngAnimate', 'toastr']);

detail.controller("TaskDetailCtrl", [
	'$scope', 
	'$http', 
	'$stateParams', 
	'TaskManager',
	'$uibModal', 
	"$state", 
	'$interval',
	'toastr',
	function($scope, $http, $stateParams, TaskManager, $uibModal, $state, $interval, toastr){
	    // 加载数据
	    var reload = function (query) {
			TaskManager.refresh().$promise.then(function(response) {
	            //TODO 错误处理
				$scope.task = TaskManager.getById($stateParams.taskID);
				$scope.refresh_random = Math.random();
	        });
	    }		

	    reload();
	    
		// 定时刷新任务列表
		var timer = $interval(function() {
			reload();
		}, 300);

	    // 打开日志的模态对话框
	    $scope.openLogModal = function (task) {
	        var modalInstance = $uibModal.open({
	            animation: true,
	            templateUrl: '/app/js/templates/output.modal.html',
	            controller: LogModalCtrl,
	            size: 'md',
	            windowTemplateUrl: '/app/js/components/modal/console.window.html',
	            resolve: {
	                "task": task,
	            }
	        })
	    }

	    // 杀死任务
	    $scope.kill = function (task) {
	        TaskManager.killTask(task.id, function() {
	        	toastr.info('Kill task successful.', 'Information')
	        	$state.go('navbar.task');
	        }, function() {
	        	toastr.error('Kill task failed.', 'Error')
	        });
	    }

	    // 删除任务
	    $scope.delete = function (task) {
	        TaskManager.deleteTask(task.id, function() {
	        	toastr.info('Delete task successful.', 'Information')
	        	$state.go('navbar.task');
	        }, function() {
	        	toastr.error('Delete task failed.', 'Error')
	        });
	    }

	    // 离开页面时删除计时器
	    $scope.$on("$destroy", function(event) {
	    	$interval.cancel(timer);
	    })
	}
]);

detail.controller("TaskCpuCtrl", function ($scope, $http, TaskManager) {
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
      datasetStrokeWidth: 0.5
    };

    // 离开页面时释放监听
    $scope.$on("$destroy", function(event) {
    	watcher();
    })       
});

detail.controller("TaskMemCtrl", function ($scope, $http) {
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
      datasetStrokeWidth: 0.5,
      backgroundColor: "#fff",
    };

    // 离开页面时释放监听
    $scope.$on("$destroy", function(event) {
    	watcher();
    })   
});

detail.controller("TaskLogCtrl", function ($scope, $stateParams, TaskManager) {
    var reload = function (query) {
        TaskManager.getTaskFile($stateParams.taskID, 'stderr', function(response){
            $scope.logs = response.message.split('\n');
        });
    }			
    reload();
});


detail.controller("TaskOutputCtrl", function ($scope, $stateParams, TaskManager) {
    var reload = function (query) {
        TaskManager.getTaskFile($stateParams.taskID, 'stdout', function(response){
            $scope.output = response.message.split('\n');
        });
    }			
    reload();
});


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