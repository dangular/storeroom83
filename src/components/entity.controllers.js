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
            perPage: 5,
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

        $scope.remove = function(entity) {
            return restRepository.remove(entity);
        }

    }])

    .controller('EntityFormController', ['entity', '$scope', '$rootScope', 'AlertService', '$state', '$log', '$window', function(entity, $scope, $rootScope, alertService, $state, $log, $window) {
        $scope.entity = entity;
        var isNew = function() {
            return !$scope.entity._id;
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
                    alertService.growl('success', $state.current.entityName + ' '+saved[$state.current.labelField]+' updated successfully', true);
                    $scope.$emit('s83:entityUpdated',saved);
                    $scope.backToPrevious();
                }, function(err){
                    $log.error(err);
                    alertService.inline('danger', 'Saved failed: '+err.statusText);
                });

            } else {
                $scope.restRepository.save($scope.entity).then(function(saved) {
                    alertService.growl('success', $state.current.entityName+' '+saved[$state.current.labelField]+' created successfully', true);
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