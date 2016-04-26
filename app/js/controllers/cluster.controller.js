angular.module('sher.cluster', ['ngResource', 'ui.bootstrap', 'ngAnimate', 'angular-peity'])

.controller('ClusterCtrl', [
    '$scope',
    '$http',
    '$timeout',
    '$state',
    '$stateParams',
    '$uibModal',
    '$interval',

    'Nodes',
function($scope, $http, $timeout, $state, $stateParams, $uibModal, $interval, Nodes) {
    $scope.query = $stateParams.query || "all";

	var reload = function (query) {
		Nodes.refresh().$promise.then(function(response) {
			$scope.nodes = Nodes.filterNodes(query);
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
}]);


