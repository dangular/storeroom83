/**
 * Created by: dhayes on 4/15/14.
 * Filename: entity.controllers.js
 */
angular.module('entity.controllers',['alert.services'])

    .controller('EntityController', ['restRepository', '$scope', '$timeout', function(restRepository, $scope, $timeout) {
        $scope.restRepository = restRepository;

        // scoping searchParams in top level controller so they don't go away as user performs operations on entities
        // and then returns to list.
        $scope.searchParams = {
            query: undefined,
            page: 1,
            sortField: undefined,
            sortDirection: undefined
        };

        $scope.$on('s83:entityUpdated', function() {
            $timeout(function() {
                $scope.$broadcast('s83:searchRefreshRequired');
            }, 1000);
        });

        $scope.$on('s83:entityAdded', function() {
            $timeout(function() {
                $scope.$broadcast('s83:searchRefreshRequired');
            }, 1000);
        });

    }])

    .controller('ShowController', ['$scope', '$state', 'entity', 'tabs', function($scope, $state, entity, tabs) {
        $scope.entity = entity;
        $scope.tabs = tabs;

        $scope.active = function(route){
            return $state.is(route);
        };

        $scope.$on("$stateChangeSuccess", function() {
            $scope.tabs.forEach(function(tab) {
                tab.active = $scope.active(tab.route);
            });
        });

    }])

    .controller('ListController', ['restRepository', 'gridConfig', '$scope', function(restRepository, gridConfig, $scope) {
        $scope.gridConfig = gridConfig;

        $scope.remove = function(id) {
            return restRepository.remove(id);
        }

    }])

    .controller('EntityFormController', ['entity', '$scope', '$rootScope', 'AlertService', '$state', '$log', '$window', function(entity, $scope, $rootScope, alertService, $state, $log, $window) {
        $scope.entity = entity;
        var showRoute = $state.current.showRoute;

        var isNew = function() {
            return !$scope.entity.createdAt;
        };

        if (!isNew()) {
            $scope.pageTitle = 'Edit '+$state.current.entityName;
        } else {
            $scope.pageTitle = 'Add '+$state.current.entityName;
        }

        $scope.isNew = isNew;

        $scope.backToPrevious = function() {
            if ($rootScope.previousState){
                $state.go($rootScope.previousState, $rootScope.previousStateParams);
            } else {
                $window.history.back();
            }
        };

        $scope.save = function() {
            if (!isNew()) {
                $scope.restRepository.update($scope.entity).then(function(saved) {
                    var showAnchor = '<p><a href="'+$state.href(showRoute, {id: saved._id})+'">Show '+$state.current.entityName+'</a></p>';
                    alertService.growl('success', $state.current.entityName + ' '+saved[$state.current.labelField]+' updated successfully.'+showAnchor, true);
                    $scope.$emit('s83:entityUpdated',saved);
                    $scope.backToPrevious();
                }, function(err){
                    $log.error(err);
                    alertService.inline('danger', 'Saved failed: '+err.statusText);
                });

            } else {
                $scope.restRepository.save($scope.entity).then(function(saved) {
                    var showAnchor = '<p><a href="'+$state.href(showRoute, {id: saved._id})+'">Show '+$state.current.entityName+'</a></p>';
                    alertService.growl('success', $state.current.entityName+' '+saved[$state.current.labelField]+' created successfully.'+showAnchor, true);
                    $scope.$emit('s83:entityAdded',saved);
                    $scope.backToPrevious();
                }, function(err){
                    $log.error(err);
                    alertService.inline('danger', 'Saved failed: '+err.statusText, true);
                    $scope.saving = false;
                });

            }
        };
    }]);