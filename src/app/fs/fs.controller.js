(function() {
  'use strict';

  angular
    .module('sherFrontend')
    .controller('FileSystemController', FileSystemController)
    .config(['fileManagerConfigProvider', config]);

  /** @ngInject */
  function config(config) {
    config.set({
      searchForm: true,
      optionButton: true,
      breadcrumb: true,
      showSizeForDirectories: true,
      viewTable: true,
      allowedActions: {
        upload: true,
        rename: true,
        move: true,
        copy: true,
        edit: true,
        changePermissions: false,
        compress: false,
        compressChooseName: false,
        extract: false,
        download: true,
        downloadMultiple: true,
        preview: true,
          remove: true
      },         
    })
  }

  /** @ngInject */
  function FileSystemController($scope, fileNavigator){
    $scope.options = {
      breadcrumb: true,
      optionButton: true,
      showSizeForDirectories: true,
      allowedActions: {
          upload: true,
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
  }

})();
