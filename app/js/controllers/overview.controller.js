'use strict';

var overview = angular.module("sher.overview", ["chart.js", "angular-peity"]);

overview.controller("tableCtrl", ['$scope', '$state', 'Tasks', function ($scope, $state, Tasks) {
	Tasks.refresh().$promise.then(function(response) {
        $scope.tasks = Tasks.getTasks().slice(0, 5);
    });

    $scope.rowClick = function(taskID){
		$state.go('navbar.detail',{taskID: taskID});
	};
}
]);

overview.controller("heathyCtrl", ['$scope', '$interval', 'Tasks', function ($scope, $interval, Tasks) {
    $scope.cpu = {
        data: [15, 22, 73, 43, 33, 12, 20, 16, 24, 8],
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
    	data: [15, 22, 13, 43, 33, 12, 20, 16, 24, 9],
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
    	data: [15, 22, 13, 43, 33, 12, 20, 16, 24, 9],
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
}
]);
// overview.controller("pieCtrl", ['$scope', '$interval', 'Tasks', function ($scope, $interval, Tasks) {
// 	//TODO 增加service
//     var reload = function (query) {
// 		Tasks.refresh().$promise.then(function(response) {
// 			$scope.archive_data = Tasks.taskArchive();
// 		  	$scope.archive_label = ["finished", "staging", "failed", "running", "killed", "lost"];
			
// 			if(isZeroArray($scope.archive_data)) {
// 				$scope.notask = true;
// 			}
			
// 			Tasks.systemUsage(function(response) {
// 				var metrics = response.message;
// 			  	$scope.labels = ["free", "used"];
// 			  	$scope.cpus = [metrics.free_cpus, metrics.used_cpus];
// 			  	$scope.mem = [metrics.free_mem, metrics.used_mem];
// 			  	$scope.disk = [metrics.free_disk, metrics.used_disk];	
// 			});
// 		});
// 	}

// 	reload();

//     // 加载任务, 定时监控
//     var timer = $interval(function() {
//         reload($scope.query);
//     }, 1000);

//     // 离开页面时删除计时器
//     $scope.$on("$destroy", function(event) {
//         $interval.cancel(timer);
//     })  
// }
// ]);
overview.controller("jobCtrl", ['$scope', '$interval', '$state', function ($scope, $interval, $state) {
	$scope.job = {
		data: [27, 7, 1],
		options: {
			fill: ["#33c87e", "#8b8f9a", "#f94965"],
			radius: 30,
			innerRadius: 27,
		}
	}
}
]);

overview.controller("taskCtrl", ['$scope', '$interval', '$state', function ($scope, $interval, $state) {
    $scope.tasks = {
        running: 263,
        waiting: 139,
        waitTimeLastMinite: 23.6,
        waitTimeUnit: "ms",
        failureRatePercent: 12
    }
    $scope.overview = {
        data: [263, 139],
        options: {
            fill: ["#33c87e", "#fac543"],
            radius: 75,
            innerRadius: 71,            
        }
    }
    $scope.waitTime = {
        data: [15, 22, 73, 43, 33, 12, 20, 16, 24, 8],
        options: {
            max: 100,
            min: 0,
            stroke: "#f7c543",
            strokeWidth: 2,
            fill: "#40403e",
            width: "100%",
            height: "120px",
        }
    }
    $scope.failRate = {
        data: [15, 22, 73, 43, 33, 12, 20, 16, 24, 8],
        options: {
            max: 100,
            min: 0,
            stroke: "#f74a66",
            strokeWidth: 2,
            fill: "#403343",
            width: "100%",
            height: "120px",
        }
    }    
}
]);

overview.controller("clusterCtrl", ['$scope', '$interval', '$state', 'Nodes', function ($scope, $interval, $state, Nodes) {
	var reload = function () {
		Nodes.refresh().$promise.then(function(response) {
			$scope.masters = Nodes.getAllMasters();
			$scope.slaves = Nodes.getAllSlaves().slice(0, 6);;
			$scope.master_running = Nodes.filterMaster("RUNNING").length;
			$scope.master_lost = Nodes.filterMaster("LOST").length;
			$scope.slave_running = Nodes.filterSlave("RUNNING").length;
			$scope.slave_lost = Nodes.filterSlave("LOST").length;
	    });
	}

	reload();

    // 加载任务, 定时监控
    var node_timer = $interval(function() {
        reload();
    }, 1000);

    // 离开页面时删除计时器
    $scope.$on("$destroy", function(event) {
        $interval.cancel(node_timer);
    })  	
}
]);


function isZeroArray(array) {
	for(var i = 0; i < array.length; i++) {
		if(array[i] != 0) {
			return false;
		}
	}
	return true;
}

