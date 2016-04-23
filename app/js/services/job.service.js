var API = 'http://192.168.33.1:3030/api';

angular.module('sher.job')
    .factory('JobManager', ['$resource', '$http', function($resource, $http) {
        var jobs = [];
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
            submitJob: function(task, callback, errorHandle) {
                $http({
                    method: 'POST',
                    url: API + '/jobs',
                    data : task,
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

function handleJobs(jobs) {
    return jobs
} 

function emptyArray(size) {
    var data = new Array();
    for(var i = 0; i < size; i++) {
        data.push(0);
    }
    return data;
}

