/**
 * Created by dhayes on 4/2/14.
 */
'use strict';

// top level state definitions
angular.module('app')
    .config(['$stateProvider','$locationProvider','$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider){
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise(function($injector, $location){
            var auth = $injector.get('Auth');
            if (auth.isLoggedIn()) {
                $location.path('/dashboard');
            } else {
                $location.path('/login');
            }
        });

        $urlRouterProvider.when('/am', ['stateMapper', function(stateMapper){
            return stateMapper.redirectIfAuthenticated('am.assets');
        }]);

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: '/partials/login',
                controller: ['$scope', '$rootScope', 'Auth', '$state', 'AlertService', function($scope, $rootScope, Auth, $state, AlertService) {
                    // hard code for now
                    $scope.model = {
                        username: 'admin',
                        password: 'admin'
                    };

                    $scope.login = function() {
                        Auth.login($scope.model.username, $scope.model.password).then(function(){
                            AlertService.growl('success', 'Login successful', true);
                            if ($rootScope.targetState) {
                                var targetState = $rootScope.targetState;
                                var targetStateParams = $rootScope.targetStateParams;
                                $rootScope.targetState = null;
                                $rootScope.targetStateParams = null;
                                $state.go(targetState, targetStateParams);
                            } else {
                                $state.go('dashboard');
                            }
                        }, function() {
                            AlertService.inline('danger', 'Login failed', true);
                        });
                    };
                }]
            })
            .state('app', {
                abstract: true,
                templateUrl: '/partials/app'
            })
            .state('dashboard', {
                parent: 'app',
                url: '/dashboard',
                activeNav: 'dashboard',
                templateUrl: '/partials/dashboard/index'
            })
            .state('am', {
                parent: 'app',
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
                parent: 'app',
                url: '/work',
                activeNav: 'work',
                templateUrl: '/partials/work/index'
            })
            .state('purchasing', {
                parent: 'app',
                url: '/purchasing',
                activeNav: 'purchasing',
                templateUrl: '/partials/purchasing/index'
            })
            .state('maintenance', {
                parent: 'app',
                url: '/maintenance',
                activeNav: 'maintenance',
                templateUrl: '/partials/maintenance/index'
            })
            .state('profile', {
                parent: 'app',
                url: '/profile',
                activeNav: 'profile',
                templateUrl: '/partials/profile/profile'
            })
            .state('settings', {
                parent: 'app',
                url: '/settings',
                activeNav: 'settings',
                templateUrl: '/partials/settings/settings'
            })
            .state('help', {
                parent: 'app',
                url: '/help',
                activeNav: 'help',
                templateUrl: '/partials/help/help'
            });
    }]);
