/**
 * Created by: dhayes on 4/15/14.
 * Filename: routes.js
 */
'use strict';

angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.when('/inventory', ['stateMapper', function(stateMapper){
            return stateMapper.redirectIfAuthenticated('inventory.storerooms.list');
        }]);

        $stateProvider
            .state('inventory', {
                parent: 'app',
                url: '/inventory',
                template: '<div class="view" ui-view/>'
            });

    }]);
