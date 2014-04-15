/**
 * Created by: dhayes on 4/2/14.
 * Filename: routes.spec.js
 */
describe("Routes test", function() {
    beforeEach(module('app'));

    var location, state, rootScope, timeout;

    beforeEach(inject(function(_$location_, _$state_, _$rootScope_, _$timeout_){
        rootScope = _$rootScope_;
        location = _$location_;
        state = _$state_;
        timeout = _$timeout_;

    }));

    describe('storerooms list route', function(){
        var $httpBackend;

        beforeEach(inject(function(_$httpBackend_){
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('/partials/inventory/layout')
                .respond(200, 'Layout html');
            $httpBackend.expectGET('/api/inventory/storerooms')
                .respond(200, ['foo','bar']);
            $httpBackend.expectGET('/partials/inventory/storerooms/layout')
                .respond(200, 'Storerooms layout');
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

    describe('items route', function(){
        beforeEach(inject(function($httpBackend){
            $httpBackend.expectGET('/partials/inventory/layout')
                .respond(200, 'Layout html');
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

});