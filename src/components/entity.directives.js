/**
 * Created by: dhayes on 4/15/14.
 * Filename: entity.directives
 */
angular.module('entity.directives', ['ui.bootstrap'])

    .directive('formHeader', function() {
        return {
            restrict: 'E',
            scope: {
                formTitle: '@',
                showCancel: '@',
                cancelButtonText: '@',
                onCancel: '&'
            },
            template: "<h3 class='page-header'>{{formTitle}}" +
                        "<a ng-if='showCancel' class='btn btn-default btn-sm pull-right' ng-click='onCancel()'>{{cancelButtonText}}</a>"+
                    "</h3>"
        }
    })

    .directive('formFooter', function() {
        return {
            restrict: 'E',
            require: '^form',
            scope: {
                saveButtonText: '@',
                showCancel: '@',
                cancelButtonText: '@',
                onCancel: '&'
            },
            link: function(scope, elem, attrs, formController) {
                scope.form = formController;
            },
            template: "<h4 class='page-header'></h4>" +
                "<div class='row'>" +
                "   <div class='col-md-12 btn-toolbar text-center'>"+
                "       <button type='submit' class='btn btn-primary' ng-disabled='form.$invalid || form.$pristine || form.attempt'>{{saveButtonText}}</button>"+
                "       <a ng-if='showCancel' class='btn btn-default' ng-click='onCancel()'>{{cancelButtonText}}</a>"+
                "   </div>"+
                "</div>"

        }
    })

    .directive('submitValid', ['$parse', function($parse) {
        return {
            require: 'form',
            link: function(scope, formElement, attributes, form) {
                form.attempt = false;
                formElement.bind('submit', function (event) {
                    form.attempt = true;
                    if (!scope.$$phase) scope.$apply();

                    var fn = $parse(attributes.submitValid);

                    if (form.$valid) {
                        scope.$apply(function() {
                            fn(scope, {$event:event});
                        });
                    }
                });

                scope.$on('$destroy', function() {
                    formElement.unbind('submit');
                });
            }
        };
    }])

    .directive('field', ['$compile','$interpolate', function($compile, $interpolate) {
        var findInputElement = function(element) {
            return angular.element(element.find('input')[0] || element.find('textarea')[0] || element.find('select')[0]);
        };

        var templateMap = {
            input: '<div class="form-group" ng-class="{\'has-error\': $field.$invalid && ($field.$dirty || $form.attempt )}">'+
                '<label class="control-label">{{label}}</label>'+
                '<input class="form-control input-sm">'+
                '<small class="text-danger validation-label" ng-repeat="(key, error) in $field.$error" ng-show="error && ($field.$dirty || $form.attempt )"> {{$validationMessages[key]}}</small>',
            select: '<div class="form-group" ng-class="{\'has-error\' : $field.$invalid && $field.$dirty}">'+
                '<label class="control-label">{{label}}</label>'+
                '<select class="form-control input-sm"></select>'+
                '<small class="text-danger validation-label" ng-repeat="(key, error) in $field.$error" ng-show="error && $field.$dirty">{{$validationMessages[key]}}</small>'+
                    '</div>',
            textarea: '<div class="form-group" ng-class="{\'has-error\' : $field.$invalid && $field.$dirty}">'+
                '<label class="control-label">{{label}}</label>'+
                '<textarea class="form-control input-sm"></textarea>'+
                '<small class="text-danger validation-label" ng-repeat="(key, error) in $field.$error" ng-show="error && $field.$dirty">{{$validationMessages[key]}}</small>'+
                '</div>'
        };

        return {
            restrict:'E',
            priority: 100,        // We need this directive to happen before ng-model
            terminal: true,       // We are going to deal with this element
            require: '?^form',    // If we are in a form then we can access the ngModelController
            compile:function compile(element, attrs) {

                // Find all the <validator> child elements and extract their validation message info
                var validationMessages = [];
                angular.forEach(element.find('validator'), function(validatorElement) {
                    validatorElement = angular.element(validatorElement);
                    validationMessages.push({
                        key: validatorElement.attr('key'),
                        getMessage: $interpolate(validatorElement.text())
                    });
                });

                // Find the content that will go into the new label
                var labelContent = '';
                if ( element.attr('label') ) {
                    labelContent = element.attr('label');
                    element[0].removeAttribute('label');
                }
                if ( element.find('label')[0] ) {
                    labelContent = element.find('label').html();
                }
                if ( !labelContent ) {
                    throw new Error('No label provided');
                }

                // Load up the template for this kind of field
                var template = attrs.template || 'input';   // Default to the simple input if none given
                var getFieldElement = function() {
                    var newElement = angular.element(templateMap[template]);
                    var inputElement = findInputElement(newElement);

                    // Copy over the attributes to the input element
                    // At least the ng-model attribute must be copied because we can't use interpolation in the template
                    angular.forEach(element[0].attributes, function (attribute) {
                        var value = attribute.value;
                        var key = attribute.name;
                        inputElement.attr(key, value);
                    });

                    // Update the label's contents
                    var labelElement = newElement.find('label');
                    labelElement.html(labelContent);

                    return newElement;
                };

                return function (scope, element, attrs, formController) {
                    // We have to wait for the field element template to be loaded
                    var newElement = getFieldElement();
                    // Our template will have its own child scope
                    var childScope = scope.$new();

                    // Generate an id for the input from the ng-model expression
                    // (we need to replace dots with something to work with browsers and also form scope)
                    // (We couldn't do this in the compile function as we need the scope to
                    // be able to calculate the unique id)
                    childScope.$modelId = attrs.ngModel.replace('.', '_').toLowerCase() + '_' + childScope.$id;

                    // Wire up the input (id and name) and its label (for)
                    // (We need to set the input element's name here before we compile.
                    // If we leave it to interpolation, the formController doesn't pick it up)
                    var inputElement = findInputElement(newElement);
                    inputElement.attr('name', childScope.$modelId);
                    inputElement.attr('id', childScope.$modelId);
                    newElement.find('label').attr('for', childScope.$modelId);

                    childScope.$validationMessages = {};
                    angular.forEach(validationMessages, function(validationMessage) {
                        // We need to watch in-case it has interpolated values that need processing
                        scope.$watch(validationMessage.getMessage, function (message) {
                            childScope.$validationMessages[validationMessage.key] = message;
                        });
                    });

                    // We must compile our new element in the postLink function rather than in the compile function
                    // (i.e. after any parent form element has been linked)
                    // otherwise the new input won't pick up the FormController
                    $compile(newElement)(childScope, function(clone) {
                        // Place our new element after the original element
                        element.after(clone);
                        // Remove our original element
                        element.remove();
                    });

                    // Only after the new element has been compiled do we have access to the ngModelController
                    // (i.e. formController[childScope.name])
                    if ( formController ) {
                        childScope.$form = formController;
                        childScope.$field = formController[childScope.$modelId];
                    }
                };
            }
        };
    }])

    .directive('searchHeader', function() {
        var template =
            '<form class="form-inline" role="form">'+
                '<div class="form-group col-md-4">'+
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
                    '<label for="searchPerPage">Per Page</label>'+
                    '<select id="searchPerPage" class="form-control input-sm" ng-change="search()" ng-model="searchParams.perPage" ng-options="value for value in pageSizeOptions">'+
                '</div>'+
            '</form>';
        return {
            template: template,
            restrict: 'E',
            replace: true
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
            replace: true
        }
    })

    .directive('searchResultsTable', function() {
        var template =
            '<table class="table table-condensed table-hover">'+
                '<thead>'+
                    '<tr>'+
                        '<th ng-repeat="header in headers">'+
                            '<a href="" ng-click="sort(header.sortField)">{{header.title}}'+
                                '<span class="sort-container" ng-show="searchParams.sortField === header.sortField">'+
                                    '<i ng-class="{true: \'fa fa-arrow-up\', false: \'fa fa-arrow-down\'}[searchParams.sortDirection === \'asc\']"></i>'+
                                '</span>'+
                            '</a>'+
                        '</th>'+
                        '<th></th>'+
                    '</tr>'+
                '</thead>'+
                '<tbody>' +
                    '<tr ng-repeat="row in results.items">' +
                        '<td ng-repeat="header in headers" ng-bind-html="row.source[header.dataField] || header.render(row)"></td>'+
                        '<td class="btn-toolbar">'+
                            '<a ng-repeat="action in actionList" class="btn btn-xs" ng-class="action.btnClass" ng-click="invokeRowAction(action.onClick, row)">{{action.btnLabel}}</a>'+
                        '</td>'+
                    '</tr>'+
                '</tbody>'+
            '</table>';
        return {
            template: template,
            restrict: 'E',
            replace: true,
            controller: ['$scope', '$filter', function($scope, $filter) {

                $scope.invokeRenderAction = function(fn, row) {
                    if (fn) {
                        return fn(row, $scope, $filter);
                    } else {
                        return false;
                    }
                };

                $scope.invokeRowAction = function(fn, row) {
                    fn(row, $scope);
                }
            }]
        }
    })

    .directive('capitalize', function() {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                var capitalize = function (inputValue) {
                    if (angular.isUndefined(inputValue))
                        return;

                    var capitalized = inputValue.toUpperCase();
                    if (capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                    return capitalized;
                };
                modelCtrl.$parsers.push(capitalize);
                capitalize(scope[attrs.ngModel]);
            }
        };
    })

    .directive('changeDelay', function() {
        return {
            scope: {
                changeDelay: '&'
            },
            link: function(scope, element, attrs) {
                var timeout;
                element.on('keyup paste search', function() {
                    clearTimeout(timeout);
                    timeout = setTimeout(function() {
                        scope.changeDelay();
                        //scope.$apply();
                    }, attrs.delay || 500);
                });

                scope.$on('$destroy', function() {
                    element.unbind('keyup paste search');
                });
            }
        };
    });
