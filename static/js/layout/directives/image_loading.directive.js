/**
* ImageLoadingDirective
* @namespace jackies.layout.directives
*/
(function () {
    'use strict';

    var app = angular.module('jackies.layout.directives', []);

    app.directive('imageonload', function() {
        return {
            restrict: 'A',

            link: function(scope, element) {
              element[0].bind('load', function() {
                // Set visibility: true + remove spinner overlay
                  console.log($(".product-preview-image").height());
                  /*element.removeClass('spinner-hide');
                  element.addClass('spinner-show');
                  element.parent().find('span').remove();*/
              });
              scope.$watch('ngSrc', function() {
                // Set visibility: false + inject temporary spinner overlay
                  console.log($(".product-preview-image").height());
                  //element.addClass('spinner-hide');
                  // element.parent().append('<span class="spinner"></span>');
              });
            }
        };
    });


    })();
