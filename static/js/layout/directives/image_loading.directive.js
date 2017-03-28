/**
* ImageLoadingDirective
* @namespace jackies.layout.directives
*/
(function () {
    'use strict';

    var app = angular.module('jackies.layout.directives', []);

    app.directive('imageOnload', function() {
        return {
            restrict: 'A',

            link: function(scope, element, attrs) {

                  element.on('load', function() {
                // call the function that was passed
                //scope.$apply(attrs.imageOnload);
                      $("#loading").hide();
                      $("#product-preview").removeClass("dropdown-hidden");

                // usage: <img ng-src="src" image-onload="imgLoadedCallback()" />
            });
            }
        };
    });


    })();
