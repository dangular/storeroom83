/**
 * Created by: dhayes on 5/15/14.
 * Filename: entity.filters
 */
angular.module('entity.filters', []).filter('boolean', function() {
    return function(input) {
        // return input ? '\u2713' : '\u2718';
        if (angular.isDefined(input)) {
            return input ? 'Yes' : 'No';
        }
        return '';
    };
});