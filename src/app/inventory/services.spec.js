/**
 * Created by: dhayes on 4/9/14.
 * Filename: services.spec
 */
describe("Inventory Services", function() {
    beforeEach(module('app'));

    describe("StoreroomRepository", function() {
        var storeroomRepository;

        beforeEach(inject(function($injector){
            storeroomRepository = $injector.get('StoreroomRepository');
        }));

        describe("list()", function() {
            beforeEach(inject(function($httpBackend){
                $httpBackend.expectGET('GET', '/api/inventory/storeroom').respond(200, ['storeroom1', 'storeroom2', 'storeroom3']);
            }));

            it("should return a list of storerooms", function() {
                storeroomRepository.list().then(function(storerooms) {
                    expect(storerooms).toBeDefined();
                    expect(storerooms.length).toBe(3);
                });
            });

        });

        // test for remove()

     });

});

