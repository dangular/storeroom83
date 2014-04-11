/**
 * Created by dhayes on 4/2/14.
 */
angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.when('/inventory','/inventory/storerooms');

        $stateProvider
            .state('inventory', {
                url: '/inventory',
                templateUrl: '/partials/inventory/layout'
            })
            .state('inventory.storerooms', {
                url: '/storerooms',
                activeNav: 'inventory',
                activeSubNav: 'storerooms',
                templateUrl: '/partials/inventory/storerooms',
                controller: 'StoreroomController',
                resolve: {
                    storerooms: ['StoreroomRepository', function(storeroomRepository) {
                        return storeroomRepository.list();
                    }]
                }
            })
            .state('inventory.items', {
                url: '/items',
                activeNav: 'inventory',
                activeSubNav: 'items',
                templateUrl: '/partials/inventory/items'
            });

    }]);
