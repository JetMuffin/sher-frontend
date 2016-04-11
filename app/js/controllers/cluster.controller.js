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
	var reload = function () {
		Nodes.refresh().$promise.then(function(response) {
			$scope.masters = Nodes.getAllMasters();
			$scope.slaves = Nodes.getAllSlaves();
	    });
	}

	reload();

    // 加载任务, 定时监控
    // var node_timer = $interval(function() {
    //     reload();
    // }, 1000);

    // // 离开页面时删除计时器
    // $scope.$on("$destroy", function(event) {
    //     $interval.cancel(node_timer);
    // })     
}]);


