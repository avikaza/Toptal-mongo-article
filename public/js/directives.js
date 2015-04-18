'use strict';

/* Directives */

angular.module('myApp.directives', []).
    directive('appVersion', function (version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    })
    .directive('draggable', function(){
        return{
            restrict:"A",
            link: function(scope, element, attributes){
                console.log(element);
                element.find(".panel-group").sortable({
                    start: function( event, ui ) {
                        scope.startIndex = ui.item.index();
                    },
                    stop: function( event, ui ) {
                        scope.stopIndex = ui.item.index();
                        scope.groups.move(scope.startIndex,  scope.stopIndex);
                        scope.$apply();
                    }
                });
                element.find(".panel-group" ).disableSelection();
            }
        }
    });
