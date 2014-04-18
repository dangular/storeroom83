/**
 * Created by: dhayes on 4/15/14.
 * Filename: entity.directives
 */
angular.module('entity.directives', [])

    .directive('s83FormHeader', function() {
        return {
            restrict: 'E',
            scope: {
                formTitle: '@',
                showCancel: '@',
                cancelState: '@'
            },
            template: "<h3 class='page-header'>{{formTitle}}" +
                        "<a ng-if='showCancel && cancelState' class='btn btn-default btn-sm pull-right' ui-sref='{{cancelState}}'>Cancel</a>"+
                    "</h3>"
        }
    })

    .directive('s83FormFooter', function() {
        return {
            restrict: 'E',
            scope: {
                saveButtonText: '@',
                showCancel: '@',
                cancelButtonText: '@',
                cancelState: '@',
                onSave: '&'
            },
            template: "<h4 class='page-header'></h4>" +
                "<div class='row'>" +
                "   <div class='col-md-12 btn-toolbar text-center'>"+
                "       <button class='btn btn-primary' ng-click='onSave()'>{{saveButtonText}}</button>"+
                "       <a ng-if='showCancel && cancelState' class='btn btn-default' ui-sref='{{cancelState}}'>{{cancelButtonText}}</a>"+
                "   </div>"+
                "</div>"

        }
    })

    .directive('s83EntityTextInput', function() {
        return {
            restrict: 'E',
            scope: {
                elementId: '@',
                label: '@',
                model: '=',
                placeholder: '@'
            },
            template: "<div class='form-group'>"+
                "<label class='control-label' for='{{elementId}}'>{{label}}</label>"+
                "<input id='{{elementId}}' type='text' class='form-control input-sm' placeholder='{{placeholder}}' ng-model='model'>"+
                "</div>"
        }
    })

    .directive('s83EntityPasswordInput', function() {
        return {
            restrict: 'E',
            scope: {
                elementId: '@',
                label: '@',
                model: '='
            },
            template: "<div class='form-group'>"+
                "<label class='control-label' for='{{elementId}}'>{{label}}</label>"+
                "<input id='{{elementId}}' type='password' class='form-control input-sm' ng-model='model'>"+
                "</div>"
        }
    });

