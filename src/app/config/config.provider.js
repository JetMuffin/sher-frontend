(function() {
  'use strict';

  angular
    .module('sherFrontend')
    .provider('sherConfig', sherConfig);

  function sherConfig() {
    var values = {
      API: "http://192.168.33.1:3030/api"
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
