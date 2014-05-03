/**
 * Created by: dhayes on 4/15/14.
 * Filename: routes.js
 */
'use strict';

angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.when('/inventory', ['urlRouteMapper', function(routeMapper){
            return routeMapper.whenAuthenticated('inventory.storerooms.list');
        }]);

        $stateProvider
            .state('inventory', {
                parent: 'app',
                url: '/inventory',
                activeNav: 'inventory',
                template: '<div class="view" ui-view/>'
            });

    }]);
