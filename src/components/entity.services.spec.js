/**
 * Created by: dhayes on 4/9/14.
 * Filename: services.spec
 */
describe("Inventory Services", function() {
    beforeEach(module('app'));

    describe("RestRepository", function() {
        var repo;

        beforeEach(inject(function($injector){
            var RestRepository = $injector.get('RestRepository');
            repo = RestRepository('storerooms', '/api/inventory');
        }));

        describe("list()", function() {
            beforeEach(inject(function($httpBackend){
                $httpBackend.expectGET('GET', '/api/inventory/storeroom').respond(200, ['storeroom1', 'storeroom2', 'storeroom3']);
            }));

            it("should return a list of storerooms", function() {
                repo.list().then(function(entities) {
                    expect(entities).toBeDefined();
                    expect(entities.length).toBe(3);
                });
            });

        });

        // test for remove()

     });

});

