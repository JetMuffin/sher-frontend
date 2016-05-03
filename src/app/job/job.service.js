(function() {
  'use strict';

  angular
    .module('sherFrontend')
    .factory('jobManager', jobManager);

  /** @ngInject */
  function jobManager($log, $resource, $http, sherConfig) {
    var api = sherConfig.API;

    var jobs = [];
    var healthyCount = 0;
    var unhealthCount = 0;
    var resource = $resource(api + '/jobs', {}, {
        query: {
            method: 'get',
            timeout: 20000
        },
    })

    function getJobs (callback) {
      return resource.query({

      }, function(r) {
        return callback && callback(r);
      })
    };

    function checkFormat(job) {
        for(var i = 0; i < job.tasks.length; i++) {
            job.tasks[i].scale = parseInt(job.tasks[i].scale);
            job.tasks[i].cpus = parseFloat(job.tasks[i].cpus);
            job.tasks[i].mem = parseFloat(job.tasks[i].mem);
            job.tasks[i].disk = parseFloat(job.tasks[i].disk);
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

      // 按状态过滤任务
      getJobsByStatus: function(status) {
        if(status == 'all') {
          return jobs;
        } else {
          var result = [];
          for (var i = 0; i < jobs.length; i++) {
            if (jobs[i].status.toLowerCase() == status.toLowerCase()) {
              result.push(jobs[i]);
            }
          }
          return result;
        }
      },   

      // 按任务健康状态过滤任务
      getJobsByHealth: function(health) {
        if(health == 'all') {
            return jobs;
          } else {
            var result = [];
            for (var i = 0; i < jobs.length; i++) {
              if (jobs[i].health.toLowerCase() == health.toLowerCase()) {
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
          url: api + '/jobs',
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
          url: api + '/jobs/' + id
        }).success(function(response) {
            return callback && callback(response);
        }).error(function(response) {
            return errorHandle && errorHandle(response);
        });
      },
    }
  }
})();
