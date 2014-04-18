/**
 * Created by: dhayes on 4/2/14.
 * Filename: routes.spec.js
 */
describe("Routes test", function() {
    var location, state, rootScope, timeout, $httpBackend;

    beforeEach(module('app'));

    beforeEach(inject(function(_$location_, _$state_, _$rootScope_, _$timeout_, Auth){
        rootScope = _$rootScope_;
        location = _$location_;
        state = _$state_;
        timeout = _$timeout_;
        Auth.setUser({_id: '1', email: 'test@test.com', firstName: 'Test', lastUser: 'User', roles: ['admin']});
    }));

    beforeEach(inject(function(_$httpBackend_){
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/partials/app')
            .respond(200, 'App Layout HTML');
        $httpBackend.expectGET('/api/inventory/storerooms')
            .respond(200, ['foo','bar']);
        $httpBackend.expectGET('/partials/inventory/storerooms/list')
            .respond(200, 'Storerooms list');
    }));

    it('should change states', function(){
        location.path('/inventory/storerooms/list');
        rootScope.$digest();
        timeout(function(){
            expect(state.current.name).toBe('storerooms.list');
        });
    });

    it('should have activeNav set', function() {
        location.path('/inventory/storerooms/list');
        rootScope.$digest();
        timeout(function(){
            expect(state.activeNav).toBe('inventory');
        })
    });

    it('should resolve to URL', function() {
        expect(state.href('inventory.storerooms.list')).toEqual('/inventory/storerooms/list');
    });


});