/**
 * Created by dhayes on 4/2/14.
 */
'use strict';

angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        var collectionName = 'items', baseApiUrl = '/api/inventory',
            activeNav = 'inventory', activeSubNav = 'items',
            entityName = 'Item', labelField = 'partNumber',
            partialsPath = '/partials/inventory/items', baseUrl = '/items',
            baseStateName = 'inventory.items';

        var showDetail = {
            tabs: [
                { heading: 'Storerooms', route: 'inventory.items.show.storerooms', active: false },
                { heading: 'Detail 2', route: 'inventory.items.show.detail2', active: false },
                { heading: 'Back to List', route: 'inventory.items.list', active: false}
            ]
        };

        var renderBoolean = function(field) {
            return function(row){
                return angular.isDefined(row.source[field]) ? (row.source[field] ? 'Y' : 'N') : '' ;
            };
        };

        $urlRouterProvider.when('/inventory/items', ['urlRouteMapper', function(routeMapper){
            return routeMapper.whenAuthenticated('inventory.items.list');
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
                                {title: 'Part No', sortField: 'partNumber', cssCellClass: 'text-right', cssHeaderClass: 'text-right', visible: true, render: function(row){
                                    return '<a href="'+row.href+'">'+row.source.partNumber+'</a>';
                                }},
                                {title: 'Description', sortField: 'description.raw', visible: true, dataField: 'description', cssHeaderClass: 'col-md-4'},
                                {title: 'Commodity', sortField: 'commodity', dataField: 'commodity', visible: true},
                                {title: 'Order UOM', sortField: 'orderUnitOfMeasure', dataField: 'orderUnitOfMeasure', visible: false},
                                {title: 'Issue UOM', sortField: 'issueUnitOfMeasure', dataField: 'issueUnitOfMeasure', visible: false},
                                {title: 'Rotating', sortField: 'rotating', visible: false, render: renderBoolean('rotating')},
                                {title: 'Condition Enabled', sortField: 'conditionEnabled', visible: false, render: renderBoolean('conditionEnabled')},
                                {title: 'Kit', sortField: 'kit', dataField: 'kit', visible: false, render: renderBoolean('kit')},
                                {title: 'Inspect on Receipt', sortField: 'inspectOnReceipt', visible: false, render: renderBoolean('inspectOnReceipt')},
                                {title: 'Capitalized', sortField: 'capitalized', visible: false, render: renderBoolean('capitalized')},
                                {title: 'Created At', sortField: 'createdAt', visible: true, render: function(row) {
                                    return $filter('date')(row.source.createdAt, 'medium');
                                }},
                                {title: 'Updated At', sortField: 'updatedAt', visible: true, render: function(row) {
                                    return $filter('date')(row.source.updatedAt, 'medium');
                                }}
                            ],
                            actions: [
                                {btnLabel: 'Edit', btnClass:'btn-default', onClick: function(row) {
                                    $state.go('inventory.items.edit', {id: row._id}); }
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
                entityName: entityName,
                labelField: labelField,
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
            .state(baseStateName+'.show.detail2', {
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                url: '/detail2',
                templateUrl: partialsPath+'/detail2'
            })
            .state(baseStateName+'.show.storerooms', {
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                url: '/storerooms',
                templateUrl: partialsPath+'/storerooms'
            });


    }]);
