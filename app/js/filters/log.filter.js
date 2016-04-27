
'use strict';

var sher = angular.module('sher');

sher.filter('formatLogs', function(){

    function handle(input,reference){
        return input;
    }

    return handle;
});
