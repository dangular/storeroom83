/**
 * Created by dhayes on 4/2/14.
 */
angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.when('/inventory','/inventory/storerooms/list');
        $urlRouterProvider.when('/inventory/storerooms', '/inventory/storerooms/list');
        $urlRouterProvider.when('/inventory/storerooms/:id/show', '/inventory/storerooms/:id/show/items');

        $stateProvider
            .state('inventory', {
                url: '/inventory',
                templateUrl: '/partials/inventory/layout'
            })
            .state('inventory.items', {
                url: '/items',
                activeNav: 'inventory',
                activeSubNav: 'items',
                templateUrl: '/partials/inventory/items'
            })
            .state('inventory.storerooms', {
                url: '/storerooms',
                activeNav: 'inventory',
                activeSubNav: 'storerooms',
                templateUrl: '/partials/inventory/storerooms/layout',
                controller: 'StoreroomsController',
                resolve: {
                    storerooms: ['StoreroomRepository', function(storeroomRepository) {
                        return storeroomRepository.list();
                    }]
                }
            })
            .state('inventory.storerooms.list', {
                url: '/list',
                activeNav: 'inventory',
                activeSubNav: 'storerooms',
                templateUrl: '/partials/inventory/storerooms/list',
                controller: 'StoreroomsController'
            })
            .state('inventory.storerooms.new', {
                url: '/new',
                activeNav: 'inventory',
                activeSubNav: 'storerooms',
                controller: 'StoreroomFormController',
                templateUrl: '/partials/inventory/storerooms/form',
                resolve: {
                    storeroom: function(){
                        return {};
                    }
                }
            })
            .state('inventory.storerooms.edit', {
                url: '/:id/edit',
                activeNav: 'inventory',
                activeSubNav: 'storerooms',
                controller: 'StoreroomFormController',
                templateUrl: '/partials/inventory/storerooms/form',
                resolve: {
                    storeroom: ['StoreroomRepository', '$stateParams', function(storeroomRepository, $stateParams) {
                        return storeroomRepository.edit($stateParams.id);
                    }]
                }
            })
            .state('inventory.storerooms.show', {
                url: '/:id/show',
                activeNav: 'inventory',
                activeSubNav: 'storerooms',
                controller: 'StoreroomShowController',
                templateUrl: '/partials/inventory/storerooms/show',
                resolve: {
                    storeroom: ['StoreroomRepository', '$stateParams', function(storeroomRepository, $stateParams) {
                        return storeroomRepository.load($stateParams.id);
                    }]
                }
            })
            .state('inventory.storerooms.show.items', {
                url: '/items',
                activeNav: 'inventory',
                activeSubNav: 'storerooms',
                templateUrl: '/partials/inventory/storerooms/items'
            })
            .state('inventory.storerooms.show.detail2', {
                url: '/detail2',
                activeNav: 'inventory',
                activeSubNav: 'storerooms',
                templateUrl: '/partials/inventory/storerooms/detail2'
            });


    }]);
