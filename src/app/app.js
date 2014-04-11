/**
 * Created by dhayes on 3/31/14.
 * app.js
 */
angular.module('app', ['ngAnimate', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'angular-growl', 'inventory'])

    .config(['growlProvider', function(growlProvider){
        growlProvider.globalEnableHtml(true);
    }])

    .run(['$rootScope','$state', 'sidebarService', function($rootScope, $state, sidebarService){

        $rootScope.$state = $state;

        $rootScope.$on('$stateChangeStart',function(event, toState) {
            var activeNav = toState.activeNav;
            if (activeNav && sidebarService.collapsed[activeNav]) {
                sidebarService.collapsed[activeNav] = false;
            }
        });

    }])

    .constant("alertAutoCloseTimeout", 5000)

    .service('sidebarService', function() {
        return {
            collapsed: {
                inventory: true,
                work: true,
                purchasing: true,
                am: true,
                maintenance: true
            }
        };
    })

    .controller('AppController', ['$scope', 'sidebarService', function($scope, sidebarService){

        $scope.sidebarService = sidebarService;

    }])

    .service('AlertService', ['$rootScope', '$timeout', 'growl', 'alertAutoCloseTimeout', function($rootScope, $timeout, growl, alertAutoCloseTimeout) {
        $rootScope.inlineAlerts = [];

        $rootScope.closeInLineAlert = function (index) {
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
                    templateUrl: '/partials/shared/confirm',
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

    }]);