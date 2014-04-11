/**
 * Created by: dhayes on 4/9/14.
 * Filename: storerooms.controller
 */
angular.module('inventory.controllers', ['ui.bootstrap'])

    .controller('StoreroomController', ['storerooms', '$scope', 'ConfirmService', 'AlertService', 'StoreroomRepository', function(storerooms, $scope, ConfirmService, AlertService, repository) {
        $scope.storerooms = storerooms;

        $scope.remove = function(storeroom) {

            ConfirmService.confirm("Are you sure you want to delete storeroom "+storeroom.name, function () {
                repository.remove(storeroom).then(function(){
                    $scope.storerooms = _.without($scope.storerooms, storeroom);
                    AlertService.growl('success', 'Storeroom '+storeroom.name+' successfully removed.', true);
                }, function(err){

                });
            }, function(){
                AlertService.growl('info', 'Delete canceled', true);
            });

        };
    }]);