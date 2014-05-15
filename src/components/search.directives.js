/**
 * Created by: dhayes on 5/6/14.
 * Filename: search.directives
 */
angular.module('search.directives', ['ui.bootstrap', 'ngCookies', 'search.services'])

    .directive('entitySearch', function() {
        var template =
            '<div>'+
                '<entity-search-page-header></entity-search-page-header>'+
                '<search-header></search-header>'+
                '<pagination on-select-page="goToPage(page)" total-items="results.total" page="results.page" items-per-page="itemsPerPage" max-size="5" class="pagination-sm pull-right" boundary-links="true"></pagination>'+
                '<div class="clearfix"></div>'+
                '<div class="panel panel-default" ng-show="showColumnPanel">'+
                    '<div class="panel-heading">Toggle Column Visibility' +
                        '<div class="btn-toolbar pull-right clearfix">'+
                            '<button class="btn btn-xs btn-warning" ng-click="resetColVisibility()">Reset</button>'+
                            '<button class="btn btn-xs btn-default" ng-click="showColumnPanel = false">Hide</button>'+
                        '</div>'+
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
                            '<th ng-repeat="col in visibleColumns()" ng-class="col.cssHeaderClass" >'+
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
                        '<td ng-repeat="col in visibleColumns()" ng-bind-html="col.render(row) || renderDataField(row, col.dataField)" ng-class="col.cssCellClass"></td>'+
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
                filter: '=',
                colDefs: '=',
                actions: '=',
                pageTitle: '@',
                entityName: '@',
                labelField: '@',
                createRoute: '@',
                showRoute: '@',
                searchUrl: '@',
                searchFields: '=',
                onConfirmDelete: '&'
            },
            controller: ['$scope', '$state', 'SearchService', 'ConfirmService', 'AlertService', '$cookieStore', function($scope, $state, searchService, confirmService, alertService, $cookieStore) {

                $scope.itemsPerPageOptions = [1,5,10,25,50,100,250];

                var searchSettings = $cookieStore.get('search') || {};

                if (!searchSettings[$state.current.name]) {
                    searchSettings[$state.current.name] = {};
                }

                if (!searchSettings[$state.current.name][$scope.searchUrl]) {
                    searchSettings[$state.current.name][$scope.searchUrl] = {}
                }

                $scope.itemsPerPage = searchSettings[$state.current.name][$scope.searchUrl]['perPage'] || 5;

                var defaultColumnVisibility = function() {
                    var visible = {};
                    angular.forEach($scope.colDefs, function(col) {
                        visible[col.title] = col.visible;
                    });
                    return visible;
                };

                $scope.columnVisibility = searchSettings[$state.current.name][$scope.searchUrl]['colVisibility'] || defaultColumnVisibility();

                var convertElasticSearchResults = function(raw) {
                    return {
                        total: raw.hits.total,
                        page: $scope.searchParams.page,
                        pages: Math.ceil(raw.hits.total / $scope.itemsPerPage),
                        items: _.map(raw.hits.hits, function(hit) {
                            return {
                                source: hit._source,
                                href: $state.href($scope.showRoute, {id: hit._id}),
                                _id: hit._id
                            }
                        })
                    }
                };

                $scope.itemsPerPageChanged = function() {
                    $scope.searchParams.page = 1;
                    $scope.search();
                    searchSettings[$state.current.name][$scope.searchUrl]['perPage'] = $scope.itemsPerPage;
                    $cookieStore.put('search', searchSettings);
                };

                $scope.saveColVisibility = function() {
                    searchSettings[$state.current.name][$scope.searchUrl]['colVisibility'] = $scope.columnVisibility;
                    $cookieStore.put('search', searchSettings);
                };

                $scope.resetColVisibility = function() {
                    $scope.columnVisibility = defaultColumnVisibility();
                    $scope.saveColVisibility();
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

                    if (angular.isDefined(queryString) && queryString.length > 0) {
//                        q = { prefix: { _all: queryString } }
//                        q = {
//                            multi_match: {
//                                query: queryString,
//                                type: 'phrase_prefix',
//                                fields: $scope.searchFields
//                            }
//                        }
                        q = {
                            query_string: {
                                query: queryString,
                                fields: $scope.searchFields
                            }
                        }
                    } else {
                        q = { match_all: {} }
                    }

                    if (angular.isDefined($scope.filter)) {
                        q = {
                            filtered : {
                                query : q,
                                filter: $scope.filter
                            }
                        }
                    }

                    var sort = {};
                    if ($scope.searchParams.sortField && $scope.searchParams.sortDirection) {
                        sort[$scope.searchParams.sortField] = {
                            order: $scope.searchParams.sortDirection
                        };
                    }
                    searchService.search($scope.searchUrl, {
                        from: ($scope.searchParams.page - 1) * $scope.itemsPerPage,
                        sort: sort,
                        size: $scope.itemsPerPage,
                        query: q
                    }).then(function (resp) {
                        $scope.results = convertElasticSearchResults(resp);
                    }, function (err) {
                        console.trace(err);
                        alertService.inline('danger', "Error searching for "+$scope.entityName, true);
                    });
                };

                $scope.confirmDelete = function(row) {
                    confirmService.confirm('Are you sure you want to delete '+$scope.entityName+' '+row.source[$scope.labelField], function () {
                        $scope.onConfirmDelete({id:row._id}).then(function(){
                            $scope.results.items = _.without($scope.results.items, row);
                            $scope.results.total--;
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

                $scope.renderDataField = function(row, dataField) {
                    var v = row.source;
                    var arr = dataField.split('.');
                    for(var i=0; i< arr.length; i++) {
                        v = v[arr[i]];
                    }
                    return v;
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
                    '<select id="searchPerPage" class="form-control input-sm" ng-change="itemsPerPageChanged()" ng-model="itemsPerPage" ng-options="value for value in itemsPerPageOptions">'+
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
            '<h3 ng-if="pageTitle" class="page-header">{{pageTitle}}'+
                '<a ng-if="createRoute" class="btn btn-sm btn-default pull-right" ui-sref="{{createRoute}}">'+
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

