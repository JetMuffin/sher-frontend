
'use strict';

var sher = angular.module('sher');

sher.filter('logFilter', function(){

    function logFilter(input,reference){
        console.log(input);
    }

    return "";
});
