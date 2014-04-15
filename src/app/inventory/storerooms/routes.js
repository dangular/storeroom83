/**
 * Created by dhayes on 4/2/14.
 */
angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        var collectionName = 'storerooms', baseApiUrl = '/api/inventory',
            activeNav = 'inventory', activeSubNav = 'storerooms', entityName = 'Storeroom',
            partialsPath = '/partials/inventory/storerooms', baseUrl = '/storerooms',
            baseStateName = 'inventory.storerooms', formSuccessState = 'inventory.storerooms.list';

        var showDetail = {
                tabs: [
                    { heading: "Storeroom Items", route: "inventory.storerooms.show.items", active: false },
                    { heading: "Detail 2", route: "inventory.storerooms.show.detail2", active: false },
                    { heading: "Back to List", route: "inventory.storerooms.list", active: false}
                ]
            };

        $urlRouterProvider.when('/inventory/storerooms', '/inventory/storerooms/list');
        $urlRouterProvider.when('/inventory/storerooms/:id/show', '/inventory/storerooms/:id/show/items');

        $stateProvider
            .state(baseStateName, {
                url: baseUrl,
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                template: '<div class="view" ui-view/>',
                controller: 'EntityController',
                resolve: {
                    repository: ['RestRepository', function(RestRepository) {
                        return RestRepository(collectionName, baseApiUrl);
                    }],
                    entityName: function() {
                        return entityName;
                    }
                }
            })
            .state(baseStateName+'.list', {
                url: '/list',
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                templateUrl: partialsPath+'/list',
                controller: 'ListController',
                resolve: {
                    entities: ['RestRepository', function(RestRepository) {
                        var repo = RestRepository(collectionName, baseApiUrl);
                        return repo.list();
                    }]
                }
            })
            .state(baseStateName+'.new', {
                url: '/new',
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                successState: formSuccessState,
                controller: 'EntityFormController',
                templateUrl: partialsPath+'/form',
                resolve: {
                    entity: function(){
                        return {};
                    }
                }
            })
            .state(baseStateName+'.edit', {
                url: '/:id/edit',
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                successState: formSuccessState,
                controller: 'EntityFormController',
                templateUrl: partialsPath+'/form',
                resolve: {
                    entity: ['RestRepository', '$stateParams', function(RestRepository, $stateParams) {
                        var repo = RestRepository(collectionName, baseApiUrl);
                        return repo.edit($stateParams.id);
                    }]
                }
            })
            .state(baseStateName+'.show', {
                url: '/:id/show',
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                controller: 'ShowController',
                templateUrl: partialsPath+'/show',
                resolve: {
                    entity: ['RestRepository', '$stateParams', function(RestRepository, $stateParams) {
                        var repo = RestRepository(collectionName, baseApiUrl);
                        return repo.load($stateParams.id);
                    }],
                    tabs: function() {
                        return showDetail.tabs;
                    }
                }
            })
            // The following states are almost always CUSTOM
            .state(baseStateName+'.show.items', {
                url: '/items',
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                templateUrl: partialsPath+'/items'
            })
            .state(baseStateName+'.show.detail2', {
                url: '/detail2',
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                templateUrl: partialsPath+'/detail2'
            });


    }]);
