/**
 * Created by: dhayes on 4/9/14.
 * Filename: storerooms.controller
 */
angular.module('inventory.controllers', [])

    .controller('StoreroomController', ['$scope', 'storerooms', 'StoreroomRepository', function($scope, storerooms, repository) {
        $scope.storerooms = storerooms;

        $scope.remove = function(storeroom) {
            repository.remove(storeroom).then(function(){
                $scope.storerooms = _.without($scope.storerooms, storeroom);
            });
        };
    }]);