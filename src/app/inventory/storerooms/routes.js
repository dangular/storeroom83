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

        $stateProvider
            .state(baseStateName, {
                url: baseUrl,
                template: '<div class="view" ui-view/>',
                controller: 'EntityController',
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                entityName: entityName,
                resolve: {
                    repository: ['RestRepository', function(RestRepository) {
                        return new RestRepository(collectionName, baseApiUrl);
                    }]
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
                showStateName: baseStateName +'.show.items',
                labelField: 'name',
                colHeaders: [
                    {title: 'Name', sortField: 'name', render: function(row){
                        return '<a href="'+row.href+'">'+row.source.name+'</a>';
                    }},
                    {title: 'Description', sortField: 'description', dataField: 'description'},
                    {title: 'Created At', sortField: 'createdAt', render: function(row, scope, filter) {
                        return filter('date')(row.source.createdAt, 'medium');
                    }},
                    {title: 'Updated At', sortField: 'updatedAt', render: function(row, scope, filter) {
                        return filter('date')(row.source.updatedAt, 'medium');
                    }}
                ],
                actionList: [
                    {btnLabel: 'Edit', btnClass:'btn-default', onClick: function(row, scope) {
                        scope.$state.go('inventory.storerooms.edit', {id: row.source._id}); }
                    },
                    {btnLabel: 'Delete', btnClass: 'btn-danger', onClick: function(row, scope) {
                        scope.remove(row); }
                    }
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
                url: '/{id:[0-9a-fA-F]{1,24}}/edit',
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
                url: '/{id:[0-9a-fA-F]{1,24}}/show',
                activeNav: activeNav,
                activeSubNav: activeSubNav,
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
            .state(baseStateName+'.show.detail2', {
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                url: '/detail2',
                templateUrl: partialsPath+'/detail2'
            })
            .state(baseStateName+'.show.items', {
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                url: '/items',
                templateUrl: partialsPath+'/items'
            });


    }]);
