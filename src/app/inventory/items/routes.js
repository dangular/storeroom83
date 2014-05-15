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
                { heading: 'Inventory', route: 'inventory.items.show.inventory', active: false },
                { heading: 'Vendors', route: 'inventory.items.show.vendors', active: false },
                { heading: 'Back to Items', route: 'inventory.items.list', active: false}
            ]
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
                                {title: 'Rotating', sortField: 'rotating', visible: false, render: function(row) {
                                    return $filter('boolean')(row.source.rotating);
                                }},
                                {title: 'Condition Enabled', sortField: 'conditionEnabled', visible: false, render: function(row) {
                                    return $filter('boolean')(row.source.conditionEnabled);
                                }},
                                {title: 'Kit', sortField: 'kit', dataField: 'kit', visible: false, render: function(row) {
                                    return $filter('boolean')(row.source.kit);
                                }},
                                {title: 'Inspect on Receipt', sortField: 'inspectOnReceipt', visible: false, render: function(row) {
                                    return $filter('boolean')(row.source.inspectOnReceipt);
                                }},
                                {title: 'Capitalized', sortField: 'capitalized', visible: false, render: function(row) {
                                    return $filter('boolean')(row.source.capitalized);
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
                showRoute: baseStateName+'.show.inventory',
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
                showRoute: baseStateName+'.show.inventory',
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
            .state(baseStateName+'.show.vendors', {
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                url: '/vendors',
                templateUrl: partialsPath+'/vendors'
            })
            .state(baseStateName+'.show.inventory', {
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                url: '/inventory',
                templateUrl: partialsPath + '/inventory',
                controller: ['$scope', '$state', '$filter', function ($scope, $state, $filter) {
                    $scope.inventoryFilter = {
                        term: {
                            'item._id': $scope.entity._id
                        }
                    };

                    $scope.inventorySearchParams = {
                        query: undefined,
                        page: 1,
                        sortField: undefined,
                        sortDirection: undefined
                    };

                    $scope.inventoryGridConfig = {
                        colDefs: [
                            {title: 'Inventory', sortField: 'item._id', visible: true, dataField: '_id', render: function(row) {
                                var href = $state.href('inventory.inventories.show.balances', {id: row.source._id});
                                return '<a href="'+href+'">View Detail</a>';
                            }},
                            {title: 'Storeroom', sortField: 'storeroom.name.raw', dataField: 'storeroom.name', visible: true, render: function (row) {
                                var href = $state.href('inventory.storerooms.show', {id: row.source.storeroom._id});
                                return '<a href="' + href + '">' + row.source.storeroom.name + '</a>';
                            }},
                            {title: 'Type', sortField: 'stockCategory', dataField: 'stockCategory', visible: true},
                            {title: 'Default Bin', sortField: 'defaultBin.raw', dataField: 'defaultBin', visible: true},
                            {title: 'Current Bal', sortField: 'currentBalance', dataField: 'currentBalance', visible: true, render: function (row) {
                                return $filter('number')(row.source.currentBalance, 2);
                            }},
                            {title: 'Qty Available', sortField: 'qtyAvailable', dataField: 'qtyAvailable', visible: true, render: function (row) {
                                return $filter('number')(row.source.qtyAvailable, 2);
                            }},
                            {title: 'Qty Reserved', sortField: 'qtyReserved', dataField: 'qtyReserved', visible: true, render: function (row) {
                                return $filter('number')(row.source.qtyReserved, 2);
                            }},
                            {title: 'Exp Qty', sortField: 'expiredQtyInStock', dataField: 'expiredQtyInStock', visible: false, render: function (row) {
                                return $filter('number')(row.source.expiredQtyInStock, 2);
                            }},
                            {title: 'Qty Holding', sortField: 'qtyInHoldingLocation', dataField: 'qtyInHoldingLocation', visible: false, render: function (row) {
                                return $filter('number')(row.source.qtyInHoldingLocation, 2);
                            }}
                        ],
                        actions: []

                    };

                }]
            });
    }]);
