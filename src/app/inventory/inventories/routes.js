/**
 * Created by dhayes on 4/2/14.
 */
'use strict';

angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        var collectionName = 'inventories', baseApiUrl = '/api/inventory',
            activeNav = 'inventory', activeSubNav = 'inventories',
            entityName = 'Inventory',
            partialsPath = '/partials/inventory/inventories', baseUrl = '/inventories',
            baseStateName = 'inventory.inventories';

        var showDetail = {
            tabs: [
                { heading: 'Balances', route: 'inventory.inventories.show.balances', active: false },
                { heading: 'Vendors', route: 'inventory.inventories.show.vendors', active: false },
                { heading: 'Back to Inventories', route: 'inventory.inventories.list', active: false}
            ]
        };

        $urlRouterProvider.when('/inventory/inventories', ['urlRouteMapper', function(routeMapper){
            return routeMapper.whenAuthenticated('inventory.inventories.list');
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
                                {title: 'Inventory', sortField: 'item._id', visible: true, dataField: '_id', render: function(row) {
                                    var href = $state.href('inventory.inventories.show.balances', {id: row.source._id});
                                    return '<a href="'+href+'">View Detail</a>';
                                }},
                                {title: 'Part No', sortField: 'item.partNumber.raw', visible: true, dataField: 'item.partNumber', render: function(row) {
                                    var href = $state.href('inventory.items.show', {id: row.source.item._id});
                                    return '<a href="'+href+'">'+row.source.item.partNumber+'</a>';
                                }},
                                {title: 'Description', sortField: 'item.description.raw', visible: true, dataField: 'item.description', cssHeaderClass: 'col-md-4'},
                                {title: 'Storeroom', sortField: 'storeroom.name.raw', dataField: 'storeroom.name', visible: true, render: function(row) {
                                    var href = $state.href('inventory.storerooms.show', {id: row.source.storeroom._id});
                                    return '<a href="'+href+'">'+row.source.storeroom.name+'</a>';
                                }},
                                {title: 'Type', sortField: 'stockCategory', dataField: 'stockCategory', visible: true},
                                {title: 'ABC', sortField: 'abcType', dataField: 'abcType', visible: false },
                                {title: 'Count Freq', sortField: 'countFrequency', dataField: 'countFrequency', visible: false, render: function(row) {
                                    return $filter('number')(row.source.countFrequency, 2);
                                }},
                                {title: 'Reorder Pt', sortField: 'reorderPoint', dataField: 'reorderPoint', visible: false, render: function(row) {
                                    return $filter('number')(row.source.reorderPoint, 2);
                                }},
                                {title: 'Lead Time', sortField: 'leadTimeDays', dataField: 'leadTimeDays', visible: false, render: function(row) {
                                    return $filter('number')(row.source.leadTimeDays, 0);
                                }},
                                {title: 'Safety Stock', sortField: 'safetyStock', dataField: 'safetyStock', visible: false, render: function(row) {
                                    return $filter('number')(row.source.safetyStock, 2);
                                }},
                                {title: 'EOQ', sortField: 'economicOrderQty', dataField: 'economicOrderQty', visible: false, render: function(row) {
                                    return $filter('number')(row.source.economicOrderQty, 2);
                                }},
                                {title: 'Default Bin', sortField: 'defaultBin.raw', dataField: 'defaultBin', visible: true},
                                {title: 'Current Bal', sortField: 'currentBalance', dataField: 'currentBalance', visible: true, render: function(row) {
                                    return $filter('number')(row.source.currentBalance, 2);
                                }},
                                {title: 'Qty Available', sortField: 'qtyAvailable', dataField: 'qtyAvailable', visible: true, render: function(row) {
                                    return $filter('number')(row.source.qtyAvailable, 2);
                                }},
                                {title: 'Qty Reserved', sortField: 'qtyReserved', dataField: 'qtyReserved', visible: false, render: function(row) {
                                    return $filter('number')(row.source.qtyReserved, 2);
                                }},
                                {title: 'Exp Qty', sortField: 'expiredQtyInStock', dataField: 'expiredQtyInStock', visible: false, render: function(row) {
                                    return $filter('number')(row.source.expiredQtyInStock, 2);
                                }},
                                {title: 'Qty Holding', sortField: 'qtyInHoldingLocation', dataField: 'qtyInHoldingLocation', visible: false, render: function(row) {
                                    return $filter('number')(row.source.qtyInHoldingLocation, 2);
                                }},
                                {title: 'Created At', sortField: 'createdAt', visible: false, render: function(row) {
                                    return $filter('date')(row.source.createdAt, 'medium');
                                }},
                                {title: 'Updated At', sortField: 'updatedAt', visible: false, render: function(row) {
                                    return $filter('date')(row.source.updatedAt, 'medium');
                                }}
                            ],
                            actions: [
                                {btnLabel: 'Edit', btnClass:'btn-default', onClick: function(row) {
                                    $state.go('inventory.inventories.edit', {id: row._id}); }
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
                showRoute: baseStateName+'.show.balances',
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
                showRoute: baseStateName+'.show.balances',
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
            .state(baseStateName+'.show.balances', {
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                url: '/balances',
                templateUrl: partialsPath+'/balances'
            })
            .state(baseStateName+'.show.vendors', {
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                url: '/vendors',
                templateUrl: partialsPath+'/vendors',
                resolve: {
                    item: ['RestRepository', 'entity', function(RestRepository, inventory) {
                        var repo = new RestRepository('items', baseApiUrl);
                        return repo.load(inventory.item._id);
                    }]
                },
                controller: ['$scope', 'item', function($scope, item){
                    $scope.item = item;
                }]
            });


    }]);
