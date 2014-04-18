/**
 * Created by dhayes on 4/2/14.
 */
'use strict';

angular.module('app')
    .config(['$stateProvider', function($stateProvider){

        var activeNav = 'inventory', activeSubNav = 'items';

        $stateProvider
            .state('inventory.items', {
                url: '/items',
                activeNav: activeNav,
                activeSubNav: activeSubNav,
                templateUrl: '/partials/inventory/items'
            });

    }]);
