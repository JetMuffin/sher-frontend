var API = 'http://192.168.33.1:3030/api';

angular.module('sher.task')
    .factory('TaskManager', ['$resource', '$http', function($resource, $http) {
        var tasks = [];
        var cpu_usage_data = emptyArray(15),
            mem_usage_data = emptyArray(15);
        var resource = $resource(API + '/tasks', {}, {
            query: {
                method: 'get',
                timeout: 20000
            },
        })

        var getTasks = function(callback) {
            return resource.query({

            }, function(r) {
                return callback && callback(r);
            })
        };

        return {
            // 刷新任务
            refresh: function() {
                return getTasks(function(response) {
                    tasks = handleTasks(response.message);
                })
            },

            // 重置数据
            resetData: function() {
                tasks = [];
            },

            // 获取全部的任务
            getAllTasks: function() {
                return tasks;
            },

            // 搜索任务
            getTasks: function(key) {
                if(key == 'all') {
                    return tasks;
                } else {
                    var result = [];
                    var pattern = new RegExp(key,'ig');
                    for (var i = 0; i < tasks.length; i++) {
                        if(JSON.stringify(tasks[i]).match(pattern)) {
                            result.push(tasks[i]);
                        }
                    }
                    return result;
                }
            },

            // 按ID获取任务
            getById: function(id) {
                if (!!tasks) {
                    for (var i = 0; i < tasks.length; i++) {
                        if (tasks[i].id === id) {
                            return tasks[i];
                        }
                    }
                } else {
                    return null;
                }
            },

            // 提交任务
            submitTask: function(task, callback, errorHandle) {
                $http({
                    method: 'POST',
                    url: API + '/tasks',
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
            deleteTask: function(id, callback, errorHandle) {
                $http({
                    method: 'DELETE',
                    url: API + '/tasks/' + id
                }).success(function(response) {
                    return callback && callback(response);
                }).error(function(response) {
                    return errorHandle && errorHandle(response);
                });
            },

            // 杀死任务
            killTask: function(id, callback, errorHandle) {
                $http({
                    method: 'PUT',
                    url: API + '/tasks/' + id + '/kill'
                }).success(function(response) {
                    return callback && callback(response);
                }).error(function(response) {
                    return errorHandle && errorHandle(response);
                });
            },

            // 读取任务输出
            getTaskFile: function(id, file, callback) {
                $http({
                    method: 'GET',
                    url: API + '/tasks/' + id + '/file/' + file
                }).success(function(response) {
                    return callback && callback(response);
                })
            },

            downloadTaskFile: function(id, file, callback) {
                $http({
                    method: 'GET',
                    url: API + '/tasks/' + id + '/file/' + file + '/download'
                }).success(function(response) {
                    return callback && callback(response);
                })
            },

            systemUsage: function(callback) {
                $http({
                    method: 'GET',
                    url: API + '/system/usage'
                }).success(function(response) {
                    return callback && callback(response);
                })
            },

            systemMetric: function(callback) {
                $http({
                    method: 'GET',
                    url: API + '/system/metric'
                }).success(function(response) {
                    return callback && callback(response);
                })
            },

            taskArchive: function() {
                var archive = [0,0,0,0,0,0];
                var map = {
                    "TASK_FINISHED": 0,
                    "TASK_STAGING": 1,
                    "TASK_FAILED": 2,
                    "TASK_RUNNING": 3,
                    "TASK_KILLED": 4,
                    "TASK_LOST": 5
                }
                for(var i = 0; i < tasks.length; i++) {       
                    archive[map[tasks[i].state]] ++;
                }   
                return archive;
            }
        }
    }]);

function handleTasks(tasks) {
    for(var i = 0; i < tasks.length; i++) {
        // 转换状态
        switch (tasks[i].state) {
            case "TASK_WAITING":
                tasks[i].status="WAITING";
                tasks[i].label_class="default";
            case "TASK_STAGING":
                tasks[i].status="STARTING";
                tasks[i].label_class="primary";
                break;
            case "TASK_RUNNING":
                tasks[i].status="RUNNING";
                tasks[i].label_class="info";
                break;
            case "TASK_FINISHED":
                tasks[i].status="FINISHED";
                tasks[i].label_class="success";
                break;
            case "TASK_FAILED":
                tasks[i].status="FAILED";
                tasks[i].label_class="danger";
                break;
            case "TASK_KILLED":
                tasks[i].status="KILLED";
                tasks[i].label_class="warning";
                break;
            case "TASK_LOST":
                tasks[i].status="LOST";
                tasks[i].label_class="default";
                break;
        }

        // 生成docker配置
        tasks[i].docker_config = {
            "volumes": tasks[i].volumes || [],
            "image": tasks[i].docker_image,
            "port_mappings": tasks[i].port_mappings || [],
            "network_mode": tasks[i].network_mode,
            "privileged": tasks[i].privileged,
            "parameters": tasks[i].parameters || [], 
        }

        tasks[i].docker_json = JSON.stringify(tasks[i].docker_config, null, "\t");

        // 转换类型
        tasks[i].type = tasks[i].Type == 0 ? "TEST" : "BUILD";
        tasks[i].type_color = tasks[i].Type == 0 ? "primary" : "info";
    }

    tasks.sort(function(a, b) {
        return b.create_time - a.create_time;
    })

    return tasks
} 

function emptyArray(size) {
    var data = new Array();
    for(var i = 0; i < size; i++) {
        data.push(0);
    }
    return data;
}

