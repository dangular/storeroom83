/**
 * Created by dhayes on 3/31/14.
 * app.js
 */
var app = angular.module('app', ['ui.router','ui.bootstrap']);

// top level state definitions
app.config(['$stateProvider','$locationProvider','$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider){
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise("/dashboard");

    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            activeNav: 'dashboard',
            templateUrl: '/partials/dashboard/index'
        })
        .state('inventory', {
            url: '/inventory',
            activeNav: 'inventory',
            templateUrl: '/partials/inventory/index'
        })
        .state('assets', {
            url: '/assets',
            activeNav: 'assets',
            templateUrl: '/partials/assets/index'
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
        });
}]);

app.run(['$rootScope','$state', function($rootScope, $state){

    $rootScope.$state = $state;

}]);