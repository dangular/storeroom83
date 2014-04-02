/**
 * Created by dhayes on 3/31/14.
 * app.js
 */
angular.module('app', ['ui.router','ui.bootstrap'])

    .run(['$rootScope','$state', 'sidebarService', function($rootScope, $state, sidebarService){

        $rootScope.$state = $state;

        $rootScope.$on('$stateChangeStart',function(event, toState) {
            var activeNav = toState['activeNav'];
            if (activeNav && sidebarService.collapsed[activeNav] != null) {
                sidebarService.collapsed[activeNav] = false;
            }
        });

    }])

    .service('sidebarService', function() {
        return {
            collapsed: {
                inventory: true,
                work: true,
                purchasing: true,
                am: true,
                maintenance: true
            }
        }
    })

    .controller('AppController', ['$scope', 'sidebarService', function($scope, sidebarService){

        $scope.sidebarService = sidebarService;

    }]);