(function() {
  'use strict';

  angular
    .module('sherFrontend')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $log, sherConfig) {
  	$rootScope.config = sherConfig;
  }

})();
