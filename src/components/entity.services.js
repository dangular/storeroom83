/**
 * Created by: dhayes on 4/8/14.
 * Filename: services
 */
angular.module('entity.services', ['restangular'])

    .factory('RestRepository', ['Restangular', function(Restangular) {

        return function(collectionName, baseUrl) {
            var rest = Restangular.withConfig(function(Configurer) {
                Configurer.setBaseUrl(baseUrl);
            });
            var entities = rest.all(collectionName);

            return {
                list: function() {
                    return entities.getList();
                },
                remove: function(entity) {
                    return entities.customDELETE(entity._id);
                },
                load: function(id) {
                    return entities.one(id).get();
                },
                edit: function(id) {
                    return entities.one(id).get().then(function(entity){
                        return Restangular.copy(entity);
                    });
                },
                update: function(entity) {
                    return entities.customPUT(entity, entity._id);
                },
                save: function(entity) {
                    return entities.post(entity);
                }
            };
        };
    }]);

