/**
 * Created by dhayes on 3/31/14.
 * app.js
 */
'use strict';

angular.module('app', ['ngAnimate', 'ngSanitize', 'ngCookies', 'ui.router', 'elasticsearch', 'entity.controllers', 'entity.services', 'entity.directives', 'alert.services'])

    .config(['$httpProvider', function($httpProvider) {
        var interceptor = ['$q', '$rootScope', function($q, $rootScope) {
            return {
                responseError: function(rejection) {
                    switch(rejection.status) {
                        case 401:
                            if (rejection.config.url !== '/auth/login') {
                                $rootScope.$broadcast('auth:loginRequired');
                            }
                            break;
                        case 403:
                            $rootScope.$broadcast('auth:forbidden');
                            break;
                        case 404:
                            $rootScope.$broadcast('resource:notFound');
                            break;
                        case 500:
                            $rootScope.$broadcast('server:error');
                            break;
                    }
                    return $q.reject(rejection);
                }
            };
        }];

        $httpProvider.interceptors.push(interceptor);
    }])
    .run(['$rootScope','$state', 'Auth', '$location', 'sidebarService', function($rootScope, $state, Auth, $location, sidebarService){

        $rootScope.$state = $state;

        $rootScope.$on('$stateChangeStart',function(event, toState, toParams) {
            if (toState.name !== 'login') {
                if (!Auth.isLoggedIn()) {
                    $rootScope.targetState = toState;
                    $rootScope.targetStateParams = toParams;
                    $state.transitionTo('login');
                    event.preventDefault();
                } else {
                    var activeNav = toState.activeNav;
                    if (activeNav && sidebarService.collapsed[activeNav]) {
                        sidebarService.collapsed[activeNav] = false;
                    }
                }
            }

        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if (fromState && fromState.name) {
                $rootScope.previousState = fromState;
                $rootScope.previousStateParams = fromParams;
            }
        });

        $rootScope.$on('auth:loginRequired', function() {
            $state.go('login');
        });

    }])

    .factory('stateMapper', ['$state', '$stateParams', 'Auth', function($state, $stateParams, Auth) {
        return {
            redirectIfAuthenticated: function(destination) {
                if (Auth.isLoggedIn()) {
                    $state.transitionTo(destination, $stateParams);
                    return true;
                } else {
                    return false;
                }
            }
        };
    }])

    .factory('Auth', ['$cookieStore', '$q', '$http', function($cookieStore, $q, $http){
        var _user = $cookieStore.get('user');
        var setUser = function(user) {
            _user = user;
            $cookieStore.put('user', _user);
        };
        var login = function(username, password) {
            var deferred = $q.defer();
            $http.post('/auth/session', {username: username, password: password}).success(function(result){
                _user = result;
                $cookieStore.put('user', _user);
                deferred.resolve(result);
            }).catch(function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var logout = function() {
            var deferred = $q.defer();
            $http.delete('/auth/session').success(function(){
                $cookieStore.remove('user');
                _user = null;
                deferred.resolve(true);
            }).catch(function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        };

        return {
            setUser: setUser,
            login: login,
            logout: logout,
            getUser: function() {
                return _user;
            },
            isLoggedIn: function() {
                return _user ? true : false;
            },
            getId: function() {
                return _user ? _user._id : null;
            },
            getName: function() {
                return _user ? _user.firstName : null;
            }
        };
    }])

    .service('sidebarService', function() {
        return {
            collapsed: {
                inventory: true,
                work: true,
                purchasing: true,
                am: true,
                maintenance: true
            }
        };
    })

    .service('elasticClient', ['esFactory', function (esFactory) {
        return esFactory({
            host: 'localhost:9200'
            // ...
        });
    }])

    .controller('AppController', ['$scope', '$state', 'Auth', 'sidebarService', '$location', 'AlertService', function($scope, $state, Auth, sidebarService, $location, AlertService){

        $scope.$state = $state;
        $scope.sidebarService = sidebarService;
        $scope.Auth = Auth;

        $scope.logout = function() {
            Auth.logout().then(function(){
                AlertService.growl('success', 'Logout successful', true);
                $location.path('/login');
            }, function(){
                AlertService.inline('danger', 'Logout failed', true);
            });
        };

    }]);

