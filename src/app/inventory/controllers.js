/**
 * Created by: dhayes on 4/9/14.
 * Filename: storerooms.controller
 */
angular.module('inventory.controllers', ['ui.bootstrap'])

    .controller('StoreroomsController', ['storerooms', '$scope', 'ConfirmService', 'AlertService', 'StoreroomRepository', function(storerooms, $scope, confirmService, alertService, repository) {
        $scope.storerooms = storerooms;

        $scope.remove = function(storeroom) {

            confirmService.confirm("Are you sure you want to delete storeroom "+storeroom.name, function () {
                repository.remove(storeroom).then(function(){
                    $scope.storerooms = _.without($scope.storerooms, storeroom);
                    alertService.growl('success', 'Storeroom '+storeroom.name+' successfully removed.', true);
                }, function(err){

                });
            }, function(){
                alertService.growl('info', 'Delete canceled', true);
            });

        };
    }])

    .controller('StoreroomController', ['storeroom', '$scope', function(storeroom, $scope){
        $scope.storeroom = storeroom;

    }])

    .controller('StoreroomShowController', ['$scope', '$state', 'storeroom', function($scope, $state, storeroom) {
        $scope.storeroom = storeroom;

        $scope.tabs = [
            { heading: "Storeroom Items", route:"inventory.storerooms.show.items", active:false },
            { heading: "Detail 2", route:"inventory.storerooms.show.detail2", active:false },
            { heading: "Back to List", route:"inventory.storerooms.list", active:false}
        ];

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

    .controller('StoreroomFormController', ['$scope', 'AlertService', 'storeroom', 'StoreroomRepository', '$state', '$log', function($scope, alertService, storeroom, storeroomRepository, $state, $log) {
        $scope.storeroom = storeroom;

        var isNew = function() {
            return !$scope.storeroom._id;
        };

        if (!isNew()) {
            $scope.pageTitle = 'Edit Storeroom';
        } else {
            $scope.pageTitle = 'Add Storeroom';
        }

        $scope.isNew = isNew;

        $scope.save = function() {
            if (!isNew()) {
                storeroomRepository.update($scope.storeroom).then(function(saved) {
                    alertService.growl('success', 'Storeroom '+saved.name+' updated successfully', true);
                    $state.go('inventory.storerooms.list',$state.params,{reload: true});
                }, function(err){
                    $log.error(err);
                    alertService.inline('danger', 'Saved failed\n\n'+err.data.error.message);
                });

            } else {
                storeroomRepository.save($scope.storeroom).then(function(saved) {
                    alertService.growl('success', 'Storeroom '+saved.name+' created successfully', true);
                    $state.go('inventory.storerooms.list',$state.params,{reload: true});
                }, function(err){
                    $log.error(err);
                    alertService.inline('danger', 'Saved failed\n\n'+err.data.error.message);
                });

            }
        };
    }]);