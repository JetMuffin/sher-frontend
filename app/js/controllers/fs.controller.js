angular.module('sher.fs', ['ngResource', 'ui.bootstrap', 'ngAnimate', 'FileManager'])
  
.controller('FileSystemCtrl', [
    '$scope',
function($scope) {
  	$scope.options = {
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
  	}
}]);


