/**
 * Created by: dhayes on 5/8/14.
 * Filename: search.services.js
 */
angular.module('search.services', [])

    .service('SearchService', ['$http', '$q', function($http, $q) {
        return {
            search: function(url, query) {
                var deferred = $q.defer();
                $http.post(url, query).
                    success(function(data) {
                        deferred.resolve(data)
                    }).
                    error(function(error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            }
        }
    }]);