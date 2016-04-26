'use strict';

var overview = angular.module("sher.overview", ["chart.js", "angular-peity"]);

overview.controller("tableCtrl", ['$scope', '$state', 'TaskManager', function ($scope, $state, TaskManager) {
	TaskManager.refresh().$promise.then(function(response) {
        $scope.tasks = TaskManager.getTaskManager().slice(0, 5);
    });

    $scope.rowClick = function(taskID){
		$state.go('navbar.detail',{taskID: taskID});
	};
}
]);

overview.controller("heathyCtrl", ['$scope', '$interval', 'TaskManager', function ($scope, $interval, TaskManager) {
    var totalPoints = 60;

    var reload = function() {
        TaskManager.systemUsage(function(response) {
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
]);

overview.controller("jobCtrl", ['$scope', '$interval', '$state', 'JobManager', function ($scope, $interval, $state, JobManager) {
    var reload = function () {
        JobManager.refresh().$promise.then(function(response) {
            $scope.jobs = {
                total: JobManager.getJobs('all'),
                running: JobManager.getJobs('running'),
                finished: JobManager.getJobs('finished'),
                failed: JobManager.getJobs('failed')
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
]);

overview.controller("taskCtrl", ['$scope', '$interval', '$state', 'TaskManager', function ($scope, $interval, $state, TaskManager) {
    $scope.tasks = {
        running: 0,
        waiting: 0,
        waitTimeLastMinite: 0,
        waitTimeUnit: "ms",
        failureRatePercent: 0                
    }
    var reload = function () {
        TaskManager.refresh().$promise.then(function(response) {
            $scope.tasks = {
                running: TaskManager.getTasks('running').length,
                waiting: TaskManager.getTasks('waiting').length,
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

        TaskManager.systemMetric(function (response) {
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

function emptyArray(size) {
    var result = [];
    while (data.length < size) {
        data.push(0);
    }
}

function shiftAndPush(arr, used, free) {
    arr.shift();
    arr.push(used/(used+free)*100);
    return arr;
}
