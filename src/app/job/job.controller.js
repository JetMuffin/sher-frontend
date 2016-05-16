(function() {
  'use strict';

  angular
    .module('sherFrontend')
    .controller('JobController', JobController)
    .config(['$validationProvider', function ($validationProvider) {
        $validationProvider.showSuccessMessage = false;
        $validationProvider.showErrorMessage = true; 
    }]);

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

      // 隐藏的文件管理器
      $scope.options = {
        breadcrumb: false,
        optionButton: false,
        showSizeForDirectories: false,
        viewTable: false,
        allowedActions: {
            upload: false,
            rename: false,
            move: false,
            copy: false,
            edit: false,
            changePermissions: false,
            compress: false,
            compressChooseName: false,
            extract: false,
            download: true,
            downloadMultiple: true,
            preview: true,
            remove: true
        },      
      }      

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
  var JobModalCtrl = function ($scope, $rootScope, $uibModalInstance, toastr, jobManager, $injector) {
      var $validationProvider = $injector.get('$validation');
      $scope.job = {
          tasks: [
              {
                  port_mappings: []
              }
          ],
          output_path: "/"
      }

      $scope.images = [
        {
          "name": "busybox",
          "image": "busybox",
          "icon": "/assets/images/services/docker.png"
        },
        {
          "name": "matlab",
          "image": "colin-rhodes/docker-matlab-mcr",
          "icon": "/assets/images/services/matlab.png"
        },
        {
          "name": "golang",
          "image": "docker.io/golang",
          "icon": "/assets/images/services/golang.png"
        },
        {
          "name": "nodejs",
          "image": "dockerfile/nodejs",
          "icon": "/assets/images/services/nodejs.png"
        },
        {
          "name": "java",
          "image": "dockerfile/java",
          "icon": "/assets/images/services/java.png"
        },
        {
          "name": "2048",
          "image": "alexwhen/docker-2048",
          "icon": "/assets/images/services/docker.png"
        },
      ]
      
      $scope.options = {
          breadcrumb: false,
          optionButton: false,
          showSizeForDirectories: true, 
          viewTable: false
      }
      $scope.addTask = function() {
          $scope.job.tasks.push({
              port_mappings: [

              ]                        
          })
      }

      $scope.deleteTask = function() {
          $scope.job.tasks.pop();
      }

      $scope.addPort = function(taskIndex) {
          $scope.job.tasks[taskIndex].port_mappings.push({
          })
      }

      $scope.deletePort = function(taskIndex, portIndex) {
        $scope.job.tasks[taskIndex].port_mappings.pop();
      }

      $scope.submit = function (form) {
        $validationProvider.validate(form);
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
          $rootScope.openNavigator([]);
      }

      $scope.selected_images = [{
          "name": "busybox",
          "image": "busybox",
          "icon": "/assets/images/services/docker.png"
        }];
      $scope.onImageChange = function() {
        if($scope.selected_images.length > 0) {
          $scope.job.image = $scope.selected_images[0].image;
        }
      }

      $scope.checkValid = $validationProvider.checkValid;

      // 与隐藏的filemanager交互
      var watcher = $scope.$watch('selectedModalPath', function(){
        var prefix = $scope.selectedModalPath[0] == "" ? '':'/'; 
        $scope.job.output_path = prefix + $scope.selectedModalPath.join('/');
      });

      // 离开页面时释放监听
      $scope.$on("$destroy", function(event) {
        watcher();
      })         
  };


})();
