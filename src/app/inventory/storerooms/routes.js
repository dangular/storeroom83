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
                    { heading: 'Storeroom Items', route: 'inventory.storerooms.show.items', active: false },
                    { heading: 'Detail 2', route: 'inventory.storerooms.show.detail2', active: false },
                    { heading: 'Back to List', route: 'inventory.storerooms.list', active: false}
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
            .state(baseStateName+'.show.items', {
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                url: '/items',
                templateUrl: partialsPath+'/items'
            });


    }]);
