
'use strict';

var sher = angular.module('sher');

sher.filter('taskStatus', function(){

    function handleStatus(input,reference){
        var status;
        switch (input) {
            case "TASK_WAITING":
                status="WAITING";
            case "TASK_STAGING":
                status="STAGING";
                break;
            case "TASK_RUNNING":
                status="RUNNING";
                break;
            case "TASK_FINISHED":
                status="FINISHED";
                break;
            case "TASK_FAILED":
                status="FAILED";
                break;
            case "TASK_KILLED":
                status="KILLED";
                break;
            case "TASK_LOST":
                status="LOST";
                break;
        }       
        return status;
    }

    return handleStatus;
});

sher.filter('taskStatusLabel', function(){

    function handleStatus(input,reference){
        var label_class;
        switch (input) {
            case "TASK_WAITING":
                label_class="default";
            case "TASK_STAGING":
                label_class="primary";
                break;
            case "TASK_RUNNING":
                label_class="info";
                break;
            case "TASK_FINISHED":
                label_class="success";
                break;
            case "TASK_FAILED":
                label_class="danger";
                break;
            case "TASK_KILLED":
                label_class="warning";
                break;
            case "TASK_LOST":
                label_class="default";
                break;
        }       
        return label_class;
    }

    return handleStatus;
});