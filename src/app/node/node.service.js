(function() {
  'use strict';

  angular
    .module('sherFrontend')
    .factory('nodeManager', nodeManager);

  /** @ngInject */
  function nodeManager($resource, $http, sherConfig) {
      var API = sherConfig.API;
      var nodes = [];
      var resource = $resource(API + '/nodes', {}, {
          query: {
              method: 'get',
              timeout: 20000
          },
      })

      var getNodes = function(callback) {
          return resource.query({

          }, function(r) {
              return callback && callback(r);
          })
      };

      return {
          // 刷新任务
          refresh: function() {
              return getNodes(function(response) {
                  nodes = handleNodes(response.message);
              })
          },

          // 重置数据
          resetData: function() {
              nodes = [];
          },

          // 获取全部的Master
          getAllNodes: function() {
              return nodes;
          },

          filterNodes: function(health) {
              if(health == 'all') {
                  return nodes;
              }
              var result = [];
              for(var i = 0; i < nodes.length; i++) {
                  if(nodes[i].health.toLowerCase() == health.toLowerCase()) {
                      result.push(nodes[i]);
                  }
              }
              return result;
          },

          // 按ID获取任务
          getById: function(id) {
              if (nodes.length) {
                  for (var i = 0; i < nodes.length; i++) {
                      if (nodes[i].id === id) {
                          return nodes[i];
                      }
                  }
              }  
              return null;
          },
      }
  }

  function handleNodes(nodes) {
      var oneMegabyte = 1024 * 1024;
      var oneGigabyte = 1024 * oneMegabyte;   
      var HEARTBEAT_INTERVAL = 10;
          
      var result = []
      for(var i = 0; i < nodes.length; i++) {
          // 检查节点是否down了
          var last_update_time = nodes[i].last_update_time;
          var now = Date.parse(new Date()) / 1000;
          if(now - last_update_time > HEARTBEAT_INTERVAL) {
              nodes[i].health = "Unhealthy";
          } else {
              nodes[i].health = "Healthy";
          }

          // cpu、mem数据格式化
          nodes[i].cpu_alloc = (nodes[i].resources.cpus.scalar.value - nodes[i].offered_resources.cpus.scalar.value).toFixed(2);
          nodes[i].memory_alloc = (nodes[i].resources.mem.scalar.value - nodes[i].offered_resources.mem.scalar.value);

          // 生成peity图像数据
          nodes[i].cpu_data = [nodes[i].cpu_alloc, nodes[i].offered_resources.cpus.scalar.value]
          nodes[i].memory_data = [nodes[i].memory_alloc, nodes[i].offered_resources.mem.scalar.value]
          nodes[i].cpu_options = {
              width: 100,
              height:80,            
              fill: getUsageColor(nodes[i].cpu_alloc, nodes[i].resources.cpus.scalar.value)      
          }
          nodes[i].memory_options = {
              width: 100,
              height:80,                      
              fill: getUsageColor(nodes[i].memory_alloc, nodes[i].resources.mem.scalar.value)      
          }

          // 记录任务完成度
          nodes[i].task_total = 0,
          nodes[i].task_running = 0;        
          if(nodes[i].tasks) {
              nodes[i].tasks.forEach(function(task) {
                  nodes[i].task_total++;
                  if(task.state == "TASK_RUNNING") {
                      nodes[i].task_running++;
                  }
              })
          }

          result.push(nodes[i]);
      }

      result.sort(function(a, b) {
          return b.hostname < a.hostname;
      });

      return result;
  }

  function getUsageColor(used, total) {
      var percent = used / total;
      if(percent < 0.5) {
          return ["green", "#eeeeee"];
      } else if (percent < 0.8 ){
          return ["orange", "#eeeeee"];
      } else {
          return ["red", "#eeeeee"];
      }
  }
})();
