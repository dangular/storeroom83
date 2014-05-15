/**
 * Created by dhayes on 4/2/14.
 */
'use strict';

angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        var collectionName = 'storerooms', baseApiUrl = '/api/inventory',
            activeNav = 'inventory', activeSubNav = 'storerooms',
            entityName = 'Storeroom', labelField = 'name',
            partialsPath = '/partials/inventory/storerooms', baseUrl = '/storerooms',
            baseStateName = 'inventory.storerooms';

        var showDetail = {
                tabs: [
                    { heading: 'Inventory', route: 'inventory.storerooms.show.inventory', active: false },
                    { heading: 'Detail 2', route: 'inventory.storerooms.show.detail2', active: false },
                    { heading: 'Back to Storerooms', route: 'inventory.storerooms.list', active: false}
                ]
            };

        $urlRouterProvider.when('/inventory/storerooms', ['urlRouteMapper', function(routeMapper){
            return routeMapper.whenAuthenticated('inventory.storerooms.list');
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
                                {title: 'Name', sortField: 'name', visible: true, render: function(row){
                                    return '<a href="'+row.href+'">'+row.source.name+'</a>';
                                }},
                                {title: 'Description', sortField: 'description.raw', dataField: 'description', visible: true},
                                {title: 'Control Account', sortField: 'controlAccount', dataField: 'controlAccount', visible: false},
                                {title: 'Cost Adj Account', sortField: 'costAdjAccount', dataField: 'costAdjAccount', visible: false},
                                {title: 'Receipt Var Account', sortField: 'receiptVarAccount', dataField: 'receiptVarAccount', visible: false},
                                {title: 'Purchase Var Account', sortField: 'purchaseVarAccount', dataField: 'purchaseVarAccount', visible: false},
                                {title: 'Shrinkage Account', sortField: 'shrinkageAccount', dataField: 'shrinkageAccount', visible: false},
                                {title: 'Invoice Var Account', sortField: 'invoiceVarAccount', dataField: 'invoiceVarAccount', visible: false},
                                {title: 'Currency Var Account', sortField: 'currencyVarAccount', dataField: 'currencyVarAccount', visible: false},
                                {title: 'Use in PO/PR?', sortField: 'useInPurchasing', visible: false, render: function(row){
                                    return angular.isDefined(row.source.useInPurchasing) ? (row.source.useInPurchasing ? 'Y' : 'N') : '' ;
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
                                    $state.go('inventory.storerooms.edit', {id: row._id}); }
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
            .state(baseStateName+'.show.detail2', {
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                url: '/detail2',
                templateUrl: partialsPath+'/detail2'
            })
            .state(baseStateName+'.show.inventory', {
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                url: '/inventory',
                templateUrl: partialsPath+'/inventory',
                controller: ['$scope', '$state', '$filter', function ($scope, $state, $filter) {
                    $scope.inventoryFilter = {
                        term: {
                            'storeroom._id': $scope.entity._id
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
                            {title: 'Item', sortField: 'item.partNumber.raw', dataField: 'item.partNumber', visible: true, render: function (row) {
                                var href = $state.href('inventory.items.show.inventory', {id: row.source.item._id});
                                return '<a href="' + href + '">' + row.source.item.partNumber + '</a>';
                            }},
                            {title: 'Description', sortField: 'item.description.raw', visible: true, dataField: 'item.description', cssHeaderClass: 'col-md-4'},
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
