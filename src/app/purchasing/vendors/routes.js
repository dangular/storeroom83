/**
 * Created by dhayes on 4/2/14.
 */
'use strict';

angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        var collectionName = 'vendors', baseApiUrl = '/api/purchasing',
            activeNav = 'purchasing', activeSubNav = 'vendors',
            entityName = 'Vendor', labelField = 'code',
            partialsPath = '/partials/purchasing/vendors', baseUrl = '/vendors',
            baseStateName = 'purchasing.vendors';

        var showDetail = {
                tabs: [
                    { heading: 'Orders', route: 'purchasing.vendors.show.orders', active: false },
                    { heading: 'Back to Vendors', route: 'purchasing.vendors.list', active: false}
                ]
            };

        $urlRouterProvider.when('/purchasing/vendors', ['urlRouteMapper', function(routeMapper){
            return routeMapper.whenAuthenticated('purchasing.vendors.list');
        }]);

        $stateProvider
            .state(baseStateName, {
                url: baseUrl,
                template: '<div class="view" ui-view></div>',
                controller: 'EntityController',
                resolve: {
                    restRepository: ['RestRepository', function(RestRepository) {
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
                resolve: {
                    gridConfig: ['$filter', '$state', function($filter, $state) {
                        // gridConfig is customized for each entity type
                        return {
                            colDefs: [
                                {title: 'Code', sortField: 'code', visible: true, render: function(row){
                                    return '<a href="'+row.href+'">'+row.source.code+'</a>';
                                }},
                                {title: 'Name', sortField: 'name.raw', dataField: 'name', visible: true},
                                {title: 'Active?', sortField: 'active', visible: false, render: function(row){
                                    return angular.isDefined(row.source.active) ? (row.source.active ? 'Y' : 'N') : '' ;
                                }},
                                {title: 'Created At', sortField: 'createdAt', visible: true, render: function(row) {
                                    return $filter('date')(row.source.createdAt, 'medium');
                                }},
                                {title: 'Updated At', sortField: 'updatedAt', visible: true, render: function(row) {
                                    return $filter('date')(row.source.updatedAt, 'medium');
                                }}
                            ],
                            actions: [
                                {btnLabel: 'Edit', btnClass:'btn-default', onClick: function(row) {
                                    $state.go('purchasing.vendors.edit', {id: row._id}); }
                                },
                                {btnLabel: 'Delete', btnClass: 'btn-danger', onClick: function(row, scope) {
                                    scope.confirmDelete(row); }
                                }
                            ]
                        };
                    }]
                }
            })
            .state(baseStateName+'.new', {
                url: '/new',
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                controller: 'EntityFormController',
                templateUrl: partialsPath+'/form',
                entityName: entityName,
                labelField: labelField,
                showRoute: baseStateName+'.show.orders',
                resolve: {
                    entity: ['RestRepository', function(RestRepository){
                        var repo = new RestRepository(collectionName, baseApiUrl);
                        return repo.create();
                    }]
                }
            })
            .state(baseStateName+'.edit', {
                url: '/{id:[0-9a-fA-F]{1,24}}/edit',
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                controller: 'EntityFormController',
                templateUrl: partialsPath+'/form',
                entityName: entityName,
                labelField: labelField,
                showRoute: baseStateName+'.show.orders',
                resolve: {
                    entity: ['RestRepository', '$stateParams', function(RestRepository, $stateParams) {
                        var repo = new RestRepository(collectionName, baseApiUrl);
                        return repo.edit($stateParams.id);
                    }]
                }
            })
            .state(baseStateName+'.show', {
                url: '/{id:[0-9a-fA-F]{1,24}}',
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
            .state(baseStateName+'.show.orders', {
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                url: '/orders',
                templateUrl: partialsPath+'/orders'
            });

    }]);
