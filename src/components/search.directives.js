/**
 * Created by: dhayes on 5/6/14.
 * Filename: search.directives
 */
angular.module('search.directives', ['ui.bootstrap', 'ngCookies'])

    .directive('entitySearch', function() {
        var template =
            '<div>'+
                '<entity-search-page-header></entity-search-page-header>'+
                '<search-header></search-header>'+
                '<pagination on-select-page="goToPage(page)" total-items="results.total" page="results.page" items-per-page="itemsPerPage" max-size="5" class="pagination-sm pull-right" boundary-links="true"></pagination>'+
                '<div class="clearfix"></div>'+
                '<div class="panel panel-default" ng-show="showColumnPanel">'+
                    '<div class="panel-heading">Toggle Column Visibility' +
                    '<button class="btn btn-xs btn-default pull-right clearfix" ng-click="showColumnPanel = false">Hide</button>'+
                '</div>'+
                    '<div class="panel-body" >'+
                        '<div class="col-md-3" ng-repeat="col in colDefs">'+
                            '<input type="checkbox" ng-change="saveColVisibility()" ng-model="columnVisibility[col.title]">&nbsp;{{col.title}}'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<table class="table table-condensed table-hover">'+
                    '<thead>'+
                        '<tr>'+
                            '<th ng-repeat="col in visibleColumns()">'+
                                '<a href="" ng-click="sort(col.sortField)">{{col.title}}'+
                                    '<span class="sort-container" ng-show="searchParams.sortField === col.sortField">'+
                                        '<i ng-class="{true: \'fa fa-arrow-up\', false: \'fa fa-arrow-down\'}[searchParams.sortDirection === \'asc\']"></i>'+
                                   '</span>'+
                                    '</a>'+
                            '</th>'+
                            '<th></th>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody>' +
                    '<tr ng-repeat="row in results.items">' +
                        '<td ng-repeat="col in visibleColumns()" ng-bind-html="row.source[col.dataField] || col.render(row)"></td>'+
                        '<td class="btn-toolbar">'+
                            '<a ng-repeat="action in actions" class="btn btn-xs" ng-class="action.btnClass" ng-click="invokeAction(action.onClick, row)">{{action.btnLabel}}</a>'+
                        '</td>'+
                    '</tr>'+
                    '</tbody>'+
                '</table>'+
                '<search-results-footer></search-results-footer>'+
            '</div>';
        return {
            template: template,
            restrict: 'E',
            replace: true,
            scope: {
                searchParams: '=',
                colDefs: '=',
                actions: '=',
                pageTitle: '@',
                entityName: '@',
                createRoute: '@',
                showRoute: '@',
                indexName: '@',
                indexType: '@',
                searchFields: '=',
                onConfirmDelete: '&'
            },
            controller: ['$scope', '$state', 'elasticClient', 'ConfirmService', 'AlertService', '$cookieStore', function($scope, $state, elasticClient, confirmService, alertService, $cookieStore) {

                var convertElasticSearchResults = function(raw) {
                    return {
                        total: raw.hits.total,
                        page: $scope.searchParams.page,
                        pages: Math.ceil(raw.hits.total / $scope.itemsPerPage),
                        items: _.map(raw.hits.hits, function(hit) {
                            return {
                                source: hit._source,
                                href: $state.href($scope.showRoute, {id: hit._id})
                            }
                        })
                    }
                };

                $scope.pageSizeOptions = [1,5,10,25,50,100,250];

                var initialColVisibility = function() {
                    var visible = {};
                    angular.forEach($scope.colDefs, function(col) {
                        visible[col.title] = col.visible;
                    });
                    return visible;
                };

                $scope.itemsPerPage = $cookieStore.get($scope.entityName+'.perPage') || 5;

                $scope.itemsPerPageChanged = function() {
                    console.log($scope.itemsPerPage);
                    $scope.search();
                    $cookieStore.put($scope.entityName+'.perPage', $scope.itemsPerPage);
                };

                $scope.columnVisibility = $cookieStore.get($scope.entityName+'.colVisibility') || initialColVisibility();

                $scope.saveColVisibility = function() {
                    $cookieStore.put($scope.entityName+'.colVisibility', $scope.columnVisibility);
                };

                $scope.visibleColumns = function() {
                    var result = [];
                    angular.forEach($scope.colDefs, function(col) {
                        if ($scope.columnVisibility[col.title]) {
                            result.push(col);
                        }
                    });
                    return result;
                };

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
//                        q = { prefix: { _all: queryString } }
                        q = {
                            multi_match: {
                                query: queryString,
                                type: 'phrase_prefix',
                                fields: $scope.searchFields
                            }
                        }
                    } else {
                        q = { match_all: {} }
                    }

                    var sort;
                    if ($scope.searchParams.sortField && $scope.searchParams.sortDirection) {
                        sort = $scope.searchParams.sortField + ':' + $scope.searchParams.sortDirection;
                    }
                    elasticClient.search({
                        index: $scope.indexName,
                        type: $scope.indexType,
                        from: ($scope.searchParams.page - 1) * $scope.itemsPerPage,
                        sort: sort || '',
                        size: $scope.itemsPerPage,
                        body: { query: q }
                    }).then(function (resp) {
                        $scope.results = convertElasticSearchResults(resp);
                    }, function (err) {
                        console.trace(err.message);
                        alertService.inline('danger', err.message, true);
                    });
                };

                $scope.confirmDelete = function(row) {

                    confirmService.confirm('Are you sure you want to delete '+$scope.entityName+' '+row.source.name, function () {
                        $scope.onConfirmDelete({entity:row.source}).then(function(){
                            $scope.results.items = _.without($scope.results.items, row);
                            alertService.growl('success', $scope.entityName+' '+row.source.name+' successfully removed.', true);
                        }, function(err){
                            alertService.inline('danger', err.message, true);
                        });
                    }, function(){
                        alertService.growl('info', 'Delete canceled', true);
                    });

                };

                $scope.invokeAction = function(fn, row) {
                    if (fn) {
                        fn(row, $scope);
                    }
                };

                $scope.$on('s83:searchRefreshRequired',function() {
                        $scope.search();
                });

                $scope.search();

            }]
        }
    })

    .directive('searchHeader', function() {
        var template =
            '<form class="form-inline" role="form">'+
                '<div class="form-group col-md-3">'+
                    '<label for="searchQuery">Search Query</label>'+
                    '<input id="searchQuery" class="form-control input-sm" change-delay="search()" delay="400" ng-model="searchParams.query" placeholder="Enter Query Text">'+
                '</div>'+
                '<div class="form-group col-md-1">'+
                    '<label for="searchRefresh">Refresh</label>'+
                    '<button id="searchRefresh" class="form-control input-sm btn btn-sm btn-success" ng-click="search()">'+
                        '<i class="fa fa-refresh"></i>'+
                    '</button>'+
                '</div>'+
                '<div class="form-group col-md-1">'+
                    '<label for="searchClear">Clear</label>'+
                    '<button id="searchClear" class="form-control input-sm btn btn-sm btn-warning" ng-click="clear()">'+
                        '<i class="fa fa-undo"></i>'+
                    '</button>'+
                '</div>'+
                '<div class="form-group col-md-1">'+
                    '<label for="toggleColumns">Columns</label>'+
                    '<button id="toggleColumns" class="form-control input-sm btn btn-sm btn-info" ng-click="showColumnPanel = !showColumnPanel">'+
                        '<i class="fa" ng-class="{\'fa-eye-slash\': showColumnPanel, \'fa-eye\': !showColumnPanel}"></i>'+
                    '</button>'+
                '</div>'+
                '<div class="form-group col-md-1">'+
                    '<label for="searchPerPage">Per Page</label>'+
                    '<select id="searchPerPage" class="form-control input-sm" ng-change="itemsPerPageChanged()" ng-model="itemsPerPage" ng-options="value for value in pageSizeOptions">'+
                '</div>'+
            '</form>';
        return {
            template: template,
            restrict: 'E',
            replace: true,
            scope: false
        }
    })

    .directive('searchResultsFooter', function() {
        var template =
            '<h5> Found {{results.total}} records'+
                '<span class="pull-right clearfix" ng-show="results.total">Showing page {{results.page}} of {{results.pages}}</span>'+
            '</h5>';
        return {
            template: template,
            restrict: 'E',
            replace: true,
            scope: false
        }
    })

    .directive('entitySearchPageHeader', function() {
        var template =
            '<h3 class="page-header">{{pageTitle}}'+
                '<a class="btn btn-sm btn-default pull-right" ui-sref="{{createRoute}}">'+
                    '<i class="fa fa-plus fa-lg">&nbsp;Add {{entityName}}</i>'+
                '</a>'+
            '</h3>';
        return {
            template: template,
            restrict: 'E',
            replace: true,
            scope: false
        }
    });

