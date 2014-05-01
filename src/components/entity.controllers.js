/**
 * Created by: dhayes on 4/15/14.
 * Filename: entity.controllers.js
 */
angular.module('entity.controllers',['alert.services'])

    .controller('EntityController', ['repository', 'entityName', '$scope', '$timeout', function(repository, entityName, $scope, $timeout) {
        $scope.repository = repository;

        $scope.entityName = entityName;

        // scoping searchParams in top level controller so they don't go away as user performs operations on entities
        // and then returns to list.
        $scope.searchParams = {
            query: undefined,
            page: 1,
            perPage: 5,
            sortField: undefined,
            sortDirection: undefined
        };

        $scope.$on('s83:entityUpdated', function(){
            $timeout(function() {
                $scope.$broadcast('s83:refreshSearch');
            },1000);
        });

    }])

    .controller('ShowController', ['$scope', '$state', 'entity', 'tabs', function($scope, $state, entity, tabs) {
        $scope.entity = entity;
        $scope.tabs = tabs;

        $scope.go = function(route){
            $state.go(route);
        };

        $scope.active = function(route){
            return $state.is(route);
        };

        $scope.$on("$stateChangeSuccess", function() {
            $scope.tabs.forEach(function(tab) {
                tab.active = $scope.active(tab.route);
            });
        });

    }])

    .controller('EntityFormController', ['entity', '$scope', '$rootScope', 'AlertService', '$state', '$log', '$window', function(entity, $scope, $rootScope, alertService, $state, $log, $window) {
        $scope.entity = entity;
        var isNew = function() {
            return !$scope.entity._id;
        };

        if (!isNew()) {
            $scope.pageTitle = 'Edit '+$scope.entityName;
        } else {
            $scope.pageTitle = 'Add '+$scope.entityName;
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
                $scope.repository.update($scope.entity).then(function(saved) {
                    alertService.growl('success', $scope.entityName + ' '+saved.name+' updated successfully', true);
                    $scope.$emit('s83:entityUpdated',saved);
                    $scope.backToPrevious();
                }, function(err){
                    $log.error(err);
                    alertService.inline('danger', 'Saved failed: '+err.statusText);
                });

            } else {
                $scope.repository.save($scope.entity).then(function(saved) {
                    alertService.growl('success', $scope.entityName+' '+saved.name+' created successfully', true);
                    $scope.$emit('s83:entityUpdated',saved);
                    $scope.backToPrevious();
                }, function(err){
                    $log.error(err);
                    alertService.inline('danger', 'Saved failed: '+err.statusText, true);
                    $scope.saving = false;
                });

            }
        };
    }])

    .controller('ListController', ['$scope', '$state', 'elasticClient', 'AlertService', 'ConfirmService', function($scope, $state, elasticClient, alertService, confirmService){
        $scope.headers = $state.current.colHeaders;

        var convertElasticSearchResults = function(raw) {
            return {
                total: raw.hits.total,
                page: $scope.searchParams.page,
                pages: Math.ceil(raw.hits.total / $scope.searchParams.perPage),
                items: _.map(raw.hits.hits, function(hit) {
                    return hit._source;
                })
            }
        };

        $scope.pageSizeOptions = [5,10,25,50,100,250];

        $scope.clear = function() {
            $scope.searchParams.query = undefined;
            $scope.searchParams.sortField = undefined;
            $scope.searchParams.sortDirection = undefined;
            $scope.search();
        };

        $scope.changePerPage = function() {
            $scope.searchParams.page = 1;
            $scope.search();
        };

        $scope.goToPage = function(pageNum) {
            $scope.searchParams.page = pageNum;
            $scope.search();
        };

        $scope.sort = function(sortBy) {
            if ($scope.searchParams.sortField === sortBy)
                $scope.searchParams.sortDirection =  $scope.searchParams.sortDirection == 'asc' ? 'desc' : 'asc';
            else {
                $scope.searchParams.sortField = sortBy;
                $scope.searchParams.sortDirection = 'asc';
            }
            $scope.search();
        };

        $scope.search = function() {
            var q;
            var queryString = $scope.searchParams.query;

            if (angular.isString(queryString) && queryString.length > 0) {
                q = { prefix: { _all: queryString } }
            } else {
                q = { match_all: {} }
            }

            var sort;
            if ($scope.searchParams.sortField && $scope.searchParams.sortDirection) {
                sort = $scope.searchParams.sortField + ':' + $scope.searchParams.sortDirection;
            }
            elasticClient.search({
                index: $state.current.index,
                type: $state.current.type,
                from: ($scope.searchParams.page - 1) * $scope.searchParams.perPage,
                sort: sort || '',
                size: $scope.searchParams.perPage,
                body: { query: q }
            }).then(function (resp) {
                $scope.results = convertElasticSearchResults(resp);
            }, function (err) {
                console.trace(err.message);
                alertService.inline('danger', err.message, true);
            });
        };

        $scope.remove = function(entity) {

            confirmService.confirm("Are you sure you want to delete "+$scope.entityName+" "+entity.name, function () {
                $scope.repository.remove(entity).then(function(){
                    $scope.results.items = _.without($scope.results.items, entity);
                    alertService.growl('success', $scope.entityName + ' '+entity.name+' successfully removed.', true);
                }, function(err){
                    alertService.inline('danger', err.message, true);
                });
            }, function(){
                alertService.growl('info', 'Delete canceled', true);
            });

        };

        $scope.$on('s83:refreshSearch',function() {
            $scope.search();
        });

        $scope.search();


    }]);