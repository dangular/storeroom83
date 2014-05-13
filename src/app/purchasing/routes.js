/**
 * Created by: dhayes on 4/15/14.
 * Filename: routes.js
 */
'use strict';

angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.when('/purchasing', ['urlRouteMapper', function(routeMapper){
            return routeMapper.whenAuthenticated('purchasing.vendors.list');
        }]);

        $stateProvider
            .state('purchasing', {
                parent: 'app',
                url: '/purchasing',
                activeNav: 'purchasing',
                template: '<div class="view" ui-view/>'
            })
            .state('purchasing.receiving', {
                url: '/receiving',
                activeNav: 'purchasing',
                activeSubNav: 'receiving',
                templateUrl: '/partials/purchasing/receiving/list'
            })
            .state('purchasing.purchaseOrders', {
                url: '/po',
                activeNav: 'purchasing',
                activeSubNav: 'purchaseOrders',
                templateUrl: '/partials/purchasing/purchaseOrders/list'
            })
            .state('purchasing.purchaseRequisitions', {
                url: '/pr',
                activeNav: 'purchasing',
                activeSubNav: 'purchaseRequisitions',
                templateUrl: '/partials/purchasing/purchaseRequisitions/list'
            })
            .state('purchasing.requestForQuote', {
                url: '/rfq',
                activeNav: 'purchasing',
                activeSubNav: 'requestForQuote',
                templateUrl: '/partials/purchasing/requestForQuote/list'
            });


    }]);
