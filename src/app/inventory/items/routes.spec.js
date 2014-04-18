/**
 * Created by: dhayes on 4/2/14.
 * Filename: routes.spec.js
 */
describe("Items routes test", function() {
    var location, state, rootScope, timeout;

    beforeEach(module('app'));

    beforeEach(inject(function(_$location_, _$state_, _$rootScope_, _$timeout_, Auth){
        rootScope = _$rootScope_;
        location = _$location_;
        state = _$state_;
        timeout = _$timeout_;
        Auth.setUser({_id: '1', email: 'test@test.com', firstName: 'Test', lastUser: 'User', roles: ['admin']});
    }));

    beforeEach(inject(function($httpBackend){
        $httpBackend.expectGET('/partials/app')
            .respond(200, 'App Layout HTML');
        $httpBackend.expectGET('/partials/inventory/items')
            .respond(200, 'Items html');
    }));

    it('should change states', function(){
        location.path('/inventory/items');
        rootScope.$digest();
        timeout(function(){
            expect(state.current.name).toBe('items');
        });
    });

    it('should have activeNav set', function() {
        location.path('/inventory/items');
        rootScope.$digest();
        timeout(function(){
            expect(state.activeNav).toBe('inventory');
        })
    });

    it('should resolve to URL', function() {
        expect(state.href('inventory.items')).toEqual('/inventory/items');
    });


});