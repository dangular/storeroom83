/**
 * Created by: dhayes on 4/9/14.
 * Filename: controllers.spec
 */
describe("Inventory Controllers", function() {
    beforeEach(module('app'));

    describe("StoreroomController", function() {
        var storeroomController, scope;

        beforeEach(inject(function($controller){
            scope = {};
            storeroomController = $controller('StoreroomController', {$scope: scope, storerooms: ['one','two','three']});
        }));

        it("should have storerooms defined on scope", function() {
            expect(scope.storerooms).toBeDefined();
            expect(scope.storerooms.length).toBe(3);
        });

    });

});

