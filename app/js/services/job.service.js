var API = 'http://192.168.33.1:3030/api';

angular.module('sher.job')
    .factory('JobManager', ['$resource', '$http', function($resource, $http) {
        var jobs = [];
        var healthyCount = 0;
        var unhealthCount = 0;
        var resource = $resource(API + '/jobs', {}, {
            query: {
                method: 'get',
                timeout: 20000
            },
        })

        var getJobs = function(callback) {
            return resource.query({

            }, function(r) {
                return callback && callback(r);
            })
        };

        return {
            // 刷新任务
            refresh: function() {
                return getJobs(function(response) {
                    jobs = handleJobs(response.message);
                })
            },

            // 重置数据
            resetData: function() {
                jobs = [];
            },

            // 获取全部的任务
            getAllJobs: function() {
                return jobs;
            },

            // 搜索任务
            getJobs: function(key) {
                if(key == 'all') {
                    return jobs;
                } else {
                    var result = [];
                    var pattern = new RegExp(key,'ig');
                    for (var i = 0; i < jobs.length; i++) {
                        if(JSON.stringify(jobs[i]).match(pattern)) {
                            result.push(jobs[i]);
                        }
                    }
                    return result;
                }
            },

            // 按ID获取任务
            getById: function(id) {
                if (!!jobs) {
                    for (var i = 0; i < jobs.length; i++) {
                        if (jobs[i].id === id) {
                            return jobs[i];
                        }
                    }
                } else {
                    return null;
                }
            },

            // 提交任务
            submitJob: function(job, callback, errorHandle) {
                job = checkFormat(job);
                $http({
                    method: 'POST',
                    url: API + '/jobs',
                    data : job,
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; ; charset=UTF-8'
                    }
                }).success(function(response) {
                    return callback && callback(response);
                }).error(function(response) {
                    return errorHandle && errorHandle(response);
                });
            },

            // 删除任务
            deleteJob: function(id, callback, errorHandle) {
                $http({
                    method: 'DELETE',
                    url: API + '/jobs/' + id
                }).success(function(response) {
                    return callback && callback(response);
                }).error(function(response) {
                    return errorHandle && errorHandle(response);
                });
            },
        }
    }]);

function checkFormat(job) {
    job.cpus = parseFloat(job.cpus);
    job.mem = parseFloat(job.mem);
    job.disk = parseFloat(job.disk);
    for(var i = 0; i < job.tasks.length; i++) {
        job.tasks[i].scale = parseInt(job.tasks[i].scale);
    }
    return job;
}
function handleJobs(jobs) {
    jobs.sort(function(a, b) {
        return b.create_time - a.create_time;
    })

    return jobs
} 

function emptyArray(size) {
    var data = new Array();
    for(var i = 0; i < size; i++) {
        data.push(0);
    }
    return data;
}

