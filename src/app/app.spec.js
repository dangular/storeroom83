/**
 * Created by: dhayes on 4/2/14.
 * Filename: app.spec.js
 */
describe('App spec', function(){
    beforeEach(module("app"));

    describe('App controller', function(){
        var appCtrl, scope;
        beforeEach(inject(function($controller, $rootScope, sidebarService){
            scope = $rootScope.$new();
            appCtrl = $controller('AppController', {$scope: scope, sidebarService: sidebarService});
        }));

        it('should have sidebar defined', function(){
            expect(scope.sidebarService).toBeDefined();
        });

    });

    describe('SidebarService spec', function(){
        var rootScope, timeout, location, service;

        beforeEach(inject(function($injector, $location, $rootScope, $timeout){
            service = $injector.get('sidebarService');
            location = $location;
            timeout = $timeout;
            rootScope = $rootScope;
        }));

        beforeEach(inject(function($httpBackend){
            $httpBackend.expectGET('/partials/inventory/items')
                .respond(200, 'Items HTML');
        }));

        it('should not be undefined', function(){
            expect(service.collapsed).toBeDefined();
        });

        it('sidebar state attribute should be set', function(){
            location.path('/inventory/items');
            rootScope.$digest();
            timeout(function(){
                expect(service.collapsed.inventory).toBe(false);
            });
        });

        it('sidebar state attribute should be changed', function(){
            service.collapsed.inventory = true;
            location.path('/inventory/items');
            rootScope.$digest();
            timeout(function(){
                expect(service.collapsed.inventory).toBe(false);
            });
        });
    })

});
