/**
 * Created by: dhayes on 4/8/14.
 * Filename: services
 */
angular.module('inventory.services', ['restangular'])

    .factory('StoreroomRepository', ['Restangular', function(Restangular) {
        var rest = Restangular.withConfig(function(Configurer) {
            Configurer.setBaseUrl('/api/inventory');
        });

        var storerooms = rest.all('storerooms');

        return {
            list: function() {
                return storerooms.getList();
            },
            remove: function(storeroom) {
                return storerooms.customDELETE(storeroom._id);
            }
        };
    }]);

