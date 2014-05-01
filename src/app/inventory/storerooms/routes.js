/**
 * Created by dhayes on 4/2/14.
 */
'use strict';

angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        var collectionName = 'storerooms', baseApiUrl = '/api/inventory',
            activeNav = 'inventory', activeSubNav = 'storerooms', entityName = 'Storeroom',
            partialsPath = '/partials/inventory/storerooms', baseUrl = '/storerooms',
            baseStateName = 'inventory.storerooms';

        var showDetail = {
                tabs: [
                    { heading: 'Storeroom Items', route: 'inventory.storerooms.show.items', active: false },
                    { heading: 'Detail 2', route: 'inventory.storerooms.show.detail2', active: false },
                    { heading: 'Back to List', route: 'inventory.storerooms.list', active: false}
                ]
            };

        $urlRouterProvider.when('/inventory/storerooms', ['stateMapper', function(stateMapper){
            return stateMapper.redirectIfAuthenticated('inventory.storerooms.list');
        }]);
        $urlRouterProvider.when('/inventory/storerooms/:id/show', ['stateMapper', function(stateMapper){
            return stateMapper.redirectIfAuthenticated('inventory.storerooms.show.items');
        }]);

        $stateProvider
            .state(baseStateName, {
                url: baseUrl,
                template: '<div class="view" ui-view/>',
                controller: 'EntityController',
                resolve: {
                    repository: ['RestRepository', function(RestRepository) {
                        return new RestRepository(collectionName, baseApiUrl);
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
                index: 'storerooms',
                type: 'storeroom',
                colHeaders: [
                    {title: 'Name', sortField: 'name'},
                    {title: 'Description', sortField: 'description'},
                    {title: 'Created At', sortField: 'createdAt'},
                    {title: 'Updated At', sortField: 'updatedAt'}
                ]
            })
            .state(baseStateName+'.new', {
                url: '/new',
                activeNav: activeNav,
                activeSubNav: activeSubNav,
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
                controller: 'EntityFormController',
                templateUrl: partialsPath+'/form',
                resolve: {
                    entity: ['RestRepository', '$stateParams', function(RestRepository, $stateParams) {
                        var repo = new RestRepository(collectionName, baseApiUrl);
                        return repo.edit($stateParams.id);
                    }]
                }
            })
            .state(baseStateName+'.show', {
                url: '/:id/show',
                controller: 'ShowController',
                templateUrl: partialsPath+'/show',
                resolve: {
                    entity: ['RestRepository', '$stateParams', function(RestRepository, $stateParams) {
                        var repo = new RestRepository(collectionName, baseApiUrl);
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
