(function() {
  'use strict';

  angular
    .module('sherFrontend')
    .provider('sherConfig', sherConfig);

  function sherConfig() {
    var values = {
      API: "http://114.212.189.126:3030/api",
      listened_host: "114.212.189.126",
    }

    return {
      $get: get,
      set: set
    }
    
    /** @ngInject */
    function get() {
      return values;
    }

    function set(constants) {
      angular.extend(values, constants);
    }
  }
})();
