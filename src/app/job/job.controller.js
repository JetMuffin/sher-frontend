(function() {
  'use strict';

  angular
    .module('sherFrontend')
    .controller('JobController', JobController);

  /** @ngInject */
   function JobController($scope, $stateParams, $interval, $uibModal, $state, toastr, jobManager) {
      $scope.query = $stateParams.query || "all";

      // 加载数据
      var reload = function (query) {
          jobManager.refresh().$promise.then(function(response) {
              $scope.jobs = jobManager.getJobs(query)
              $scope.healthyJobCount = jobManager.getJobsByHealth('healthy').length;
              $scope.unhealthyJobCount = jobManager.getJobsByHealth('unhealthy').length;
              $scope.jobCount = jobManager.getAllJobs().length;
          });
      }

      // 初次加载数据
      reload($scope.query);

      // 搜索任务
      $scope.search = function () {
          $state.go('navbar.job', {query: $scope.search_key})
      }

      // 表格行点击
      $scope.rowClick = function(jobID){
      $state.go('navbar.jobdetail',{jobID: jobID});
    };

      // 打开提交任务的模态框
      $scope.openJobModal = function () {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'app/job/job.modal.html',
              controller: JobModalCtrl,
              size: 'md',
              windowTemplateUrl: 'app/components/modal/modal.window.html',
              resolve: {

              }
          });
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

  // 模块对话框控制器
  var JobModalCtrl = function ($scope, $uibModalInstance, toastr, jobManager) {
      $scope.job = {
          image: "busybox",
          context_dir: "",
          tasks: [
              {
                  scale: 1,
                  cmd: "ls",
                  cpus: 0.1,
                  mem: 32,
                  disk: 0,
                  port_mappings: [
                      {
                          container_port: 8080,
                          host_port: 0
                      }
                  ]
              }
          ],
          output_path: "/"
      }

      $scope.options = {
          breadcrumb: false,
          optionButton: false,
          showSizeForDirectories: true, 
          viewTable: false
      }
      $scope.addTask = function() {
          $scope.job.tasks.push({
              scale: 1,
              cmd: "ls",
              cpus: 0.1,
              mem: 32,
              disk: 0,
              port_mappings: [
                  {
                      container_port: 8080,
                      host_port: 0
                  }
              ]                        
          })
      }

      $scope.deleteTask = function() {
          $scope.job.tasks.pop();
      }

      $scope.addPort = function(taskIndex) {
          $scope.job.tasks[taskIndex].port_mappings.push({
              container_port: 8080,
              host_port: 0
          })
      }

      $scope.deletePort = function(taskIndex, portIndex) {
          console.log(taskIndex);
          $scope.job.tasks[taskIndex].port_mappings.splice(portIndex, 1);
      }

      $scope.addVolume = function() {
          $scope.job.volumes.push('');
      }

      $scope.deleteVolume = function(index) {
          $scope.job.volumes.pop();
      }

      $scope.submit = function () {
          jobManager.submitJob($scope.job, function(){
              toastr.success('Create job successful!');
          }, function() {
              toastr.error('Create job failed!');
          });
          $uibModalInstance.close();
      };

      $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };

      $scope.open = function() {
          $scope.openNavigator([]);
          console.log($scope.modal);
      }
  };


})();
