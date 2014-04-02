/**
 * Created by dhayes on 3/31/14.
 * app.js
 */
var app = angular.module('app', ['ui.router','ui.bootstrap']);

// top level state definitions
app.config(['$stateProvider','$locationProvider','$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider){
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise("/dashboard");

    $urlRouterProvider.when('/inventory','/inventory/storerooms');
    $urlRouterProvider.when('/am', '/am/assets');

    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            activeNav: 'dashboard',
            templateUrl: '/partials/dashboard/index'
        })
        .state('inventory', {
            url: '/inventory',
            templateUrl: '/partials/inventory/layout'
        })
        .state('inventory.storerooms', {
            url: '/storerooms',
            activeNav: 'inventory',
            activeSubNav: 'storerooms',
            templateUrl: '/partials/inventory/storerooms'
        })
        .state('inventory.items', {
            url: '/items',
            activeNav: 'inventory',
            activeSubNav: 'items',
            templateUrl: '/partials/inventory/items'
        })
        .state('am', {
            url: '/am',
            templateUrl: '/partials/am/layout'
        })
        .state('am.assets', {
            url: '/assets',
            activeNav: 'am',
            activeSubNav: 'assets',
            templateUrl: '/partials/am/assets'
        })
        .state('am.locations', {
            url: '/locations',
            activeNav: 'am',
            activeSubNav: 'locations',
            templateUrl: '/partials/am/locations'
        })
        .state('work', {
            url: '/work',
            activeNav: 'work',
            templateUrl: '/partials/work/index'
        })
        .state('purchasing', {
            url: '/purchasing',
            activeNav: 'purchasing',
            templateUrl: '/partials/purchasing/index'
        })
        .state('maintenance', {
            url: '/maintenance',
            activeNav: 'maintenance',
            templateUrl: '/partials/maintenance/index'
        })
        .state('profile', {
            url: '/profile',
            activeNav: 'profile',
            templateUrl: '/partials/profile/profile'
        })
        .state('settings', {
            url: '/settings',
            activeNav: 'settings',
            templateUrl: '/partials/settings/settings'
        })
        .state('help', {
            url: '/help',
            activeNav: 'help',
            templateUrl: '/partials/help/help'
        });
}]);

app.run(['$rootScope','$state', 'sidebarService', function($rootScope, $state, sidebarService){

    $rootScope.$state = $state;

    $rootScope.$on('$stateChangeStart',function(event, toState) {
        var activeNav = toState['activeNav'];
        if (activeNav && sidebarService.collapsed[activeNav] != null) {
            sidebarService.collapsed[activeNav] = false;
        }
    });

}]);

app.service('sidebarService', function() {
    return {
        collapsed: {
            inventory: true,
            work: true,
            purchasing: true,
            am: true,
            maintenance: true
        }
    }
});

app.controller('AppController', ['$scope', '$state', 'sidebarService', function($scope, $state, sidebarService){

    $scope.sidebarService = sidebarService;

}]);