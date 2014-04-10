/**
 * Created by: dhayes on 4/8/14.
 * Filename: services
 */
angular.module('inventory.services', [])

.service('StoreroomRepository', ['$q','$http', '$log', function($q,$http,$log) {
        var list = function() {
            var deferred = $q.defer();
            $http.get('/api/inventory/storeroom').success(function(storerooms) {
                deferred.resolve(storerooms);
            }).error(function(err) {
                $log.error(err);
                deferred.reject(err);
            });
            return deferred.promise;
        };

        return {
            list: list
        };

    }]);