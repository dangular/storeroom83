/**
 * Created by: dhayes on 4/15/14.
 * Filename: routes.js
 */
angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.when('/inventory','/inventory/storerooms/list');

        $stateProvider
            .state('inventory', {
                url: '/inventory',
                template: '<div class="view" ui-view/>'
            });

    }]);
