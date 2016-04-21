var API = 'http://192.168.33.1:3030/api';
var HEARTBEAT_INTERVAL = 10;

angular.module('sher')
    .factory('Nodes', ['$resource', '$http', function($resource, $http) {
        var masters = [],
            slaves = [];
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
                    masters = nodes.master
                    slaves = nodes.slave
                })
            },

            // 重置数据
            resetData: function() {
                masters = [];
                slaves = [];
            },

            // 获取全部的Master
            getAllMasters: function() {
                return masters;
            },

            getAllSlaves: function() {
                return slaves;
            },

            filterMaster: function(state) {
                var result = [];
                for(var i = 0; i < masters.length; i++) {
                    if(masters[i].state == state) {
                        result.push(masters[i]);
                    }
                }
                return result;
            },

            filterSlave: function(state) {
                var result = [];
                for(var i = 0; i < slaves.length; i++) {
                    if(slaves[i].state == state) {
                        result.push(slaves[i]);
                    }
                }
                return result;
            },

            // 按ID获取任务
            getById: function(id) {
                if (masters.length) {
                    for (var i = 0; i < masters.length; i++) {
                        if (masters[i].id === id) {
                            return masters[i];
                        }
                    }
                } else if (slaves.length) {
                    for (var i = 0; i < slaves.length; i++) {
                        if (slaves[i].id === id) {
                            return slaves[i];
                        }
                    }
                } else {
                    return null;
                }
            },
        }
    }]);

function handleNodes(nodes) {
    var oneMegabyte = 1024 * 1024;
    var oneGigabyte = 1024 * oneMegabyte;       
    var result = {
        master: [],
        slave: []
    };
    for(var i = 0; i < nodes.length; i++) {
        // 检查节点是否down了
        last_update_time = nodes[i].last_update_time;
        var now = Date.parse(new Date()) / 1000;
        if(now - last_update_time > HEARTBEAT_INTERVAL) {
            nodes[i].state = "LOST";
        } else {
            nodes[i].state = "RUNNING";
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
        if(nodes[i].task_total != 0) {
            nodes[i].task_complete = parseInt((1-nodes[i].task_running/nodes[i].task_total)*100);
        } else {
            nodes[i].task_complete = 0;
        }

        // 归档
        if(nodes[i].is_master) {
            result.master.push(nodes[i]);
        } 
        if(nodes[i].is_slave) {
            result.slave.push(nodes[i]);
        }
    }

    result.master.sort(function(a, b) {
        return b.hostname < a.hostname;
    });

    result.slave.sort(function(a, b) {
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