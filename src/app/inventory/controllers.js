/**
 * Created by: dhayes on 4/9/14.
 * Filename: storerooms.controller
 */
angular.module('inventory.controllers', [])

    .controller('StoreroomController', ['$scope', 'storerooms', function($scope, storerooms) {
        $scope.storerooms = storerooms;
    }]);