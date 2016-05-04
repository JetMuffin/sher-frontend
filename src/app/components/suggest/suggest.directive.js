angular.module('sherFrontend')

.directive('suggestBox', function(){
    return {
        restrict: 'E',
        scope: {
            listItems: '=',
            selectedItems: '=',
            onChange: '&'          
        },
        template: '<div class="suggest-box" az-suggest-box '+
            'sb-list="listItems" ' +
            'sb-model="selectedItems" ' +
            'sb-on-selection-change="onChange()" > ' +
                '<div az-suggest-box sb-list="vm.cities" class="suggest-box"> ' +
                    '<div class="select"> ' +
                        '<div class="input"> ' +
                            '<div sb-selection-item class="selection-item"> ' +
                                '{{s.name}}&nbsp;<span sb-remove-item-from-selection class="rem-btn"><i class="fa fa-times"></i></span> ' +
                            '</div> ' +
                            '<input sb-trigger-area sb-type-ahead tabindex="1"> ' +
                        '</div> ' +
                        '<button sb-trigger-area><i class="fa fa-chevron-down"></i></button> ' +
                    '</div> ' +
                    '<ul class="dropdown"> ' +
                        '<li sb-dropdown-item class="item">{{i.name}}</li> ' +
                    '</ul> ' +
                '</div>'+
            '</div>'
    }
});