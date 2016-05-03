
'use strict';

var sher = angular.module('sherFrontend');

sher.filter('formatLogs', function(){

    function handle(input,reference){
        return input;
    }

    return handle;
});
