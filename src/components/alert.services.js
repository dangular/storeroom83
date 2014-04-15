/**
 * Created by: dhayes on 4/15/14.
 * Filename: alert.services.js
 */
angular.module('alert.services', ['ui.bootstrap', 'angular-growl'])

    .config(['growlProvider', function(growlProvider){
        growlProvider.globalEnableHtml(true);
    }])

    .constant("alertAutoCloseTimeout", 5000)

    .service('AlertService', ['$rootScope', '$timeout', 'growl', 'alertAutoCloseTimeout', function($rootScope, $timeout, growl, alertAutoCloseTimeout) {
        $rootScope.inlineAlerts = [];

        $rootScope.closeInlineAlert = function (index) {
            $rootScope.inlineAlerts.splice(index, 1);
        };

        var growlOptions = {};

        return {
            growl: function(type, message, autoClose) {
                if (autoClose) {
                    growlOptions.ttl = alertAutoCloseTimeout;
                }
                switch(type) {
                    case 'success':
                        growl.addSuccessMessage(message, growlOptions);
                        break;
                    case 'info':
                        growl.addInfoMessage(message, growlOptions);
                        break;
                    case 'warn':
                        growl.addWarnMessage(message, growlOptions);
                        break;
                    case 'error':
                        growl.addErrorMessage(message, growlOptions);
                        break;
                    default:
                        growl.addInfoMessage(message, growlOptions);
                }

            },
            inline: function(type, message, autoClose) {
                var alert = {type: type, msg: message};
                $rootScope.inlineAlerts.push(alert);

                if (autoClose) {
                    $timeout(function() {
                        $rootScope.inlineAlerts = _.without($rootScope.inlineAlerts, alert);
                    }, alertAutoCloseTimeout);
                }
            }
        };
    }])

    .service('ConfirmService', ['$modal', function($modal){

        return {
            confirm: function(message, confirm, cancel) {

                var modalInstance = $modal.open({
                    templateUrl: '/alerts/confirm.html',
                    controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
                        $scope.body = message;

                        $scope.ok = function () {
                            $modalInstance.close(true);
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss(false);
                        };

                    }]
                });

                modalInstance.result.then(confirm, cancel);

            }
        };

    }])

    .run(['$templateCache', function($templateCache){

        $templateCache.put('/alerts/confirm.html',
            "<div class='modal-header'>"+
                "<h3 class='text-primary'>Confirm</h3>"+
            "</div>"+
            "<div class='modal-body'>{{body}}</div>"+
            "<div class='modal-footer'>"+
                "<button class='btn btn-primary' ng-click='ok()'>Confirm</button>"+
                "<button class='btn btn-default' ng-click='cancel()'>Cancel</button>"+
            "</div>"
        );

    }]);