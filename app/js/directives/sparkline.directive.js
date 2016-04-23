angular.module('sparkline', []);
  
angular.module('sparkline')
    .directive('sparkline', [function () {
        'use strict';
        return {
            restrict: 'EA',
            scope: {
              data: '=',
              options: '='
            },
            template : `<span></span>`,            
            link: function (scope, elem, attrs) {
                var opts = {};
                var model;

                opts.type = attrs.type || 'line';

                scope.$watchCollection('data', newVal => {
                  if (newVal) {
                    model = newVal;
                    render(newVal, null);
                  }
                });

                scope.$watch('options', newVal => {
                    if (newVal) {
                        render(model, newVal);
                    }
                });

                function render(data, options) {
                    if(options) {
                        angular.extend(opts, options);
                    }

                    $(elem).find('span').sparkline(data, opts);
                }
            }
        }
    }]);


