(function() {
  'use strict';

  angular
    .module('sherFrontend')
    .controller('NodeController', NodeController);

  /** @ngInject */
   function NodeController($scope, $http, $state, $stateParams, $interval, nodeManager) {
    $scope.query = $stateParams.query || "all";

	var reload = function (query) {
		nodeManager.refresh().$promise.then(function(response) {
			$scope.nodes = nodeManager.filterNodes(query);
	    });
	}

	reload($scope.query);

    // 加载任务, 定时监控
    var node_timer = $interval(function() {
        reload($scope.query);
    }, 1000);

    // 离开页面时删除计时器
    $scope.$on("$destroy", function(event) {
        $interval.cancel(node_timer);
    })     
}

})();
