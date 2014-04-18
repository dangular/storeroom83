/**
 * Created by: dhayes on 4/9/14.
 * Filename: inventory
 */
var app = require('../server'),
    should = require('should'),
    request = require('supertest');

describe('inventory routes', function(){
    describe('when requesting resource /api/inventory/storerooms', function(){
        it('should respond with 401 - Unauthorized', function(done){
            request(app).get('/api/inventory/storerooms')
                .expect('Content-Type', /json/)
                .expect(401)
                .end(function(){
                    done();
                });
        });
    });

    // test for GET /api/inventory/storerooms/:id

    // test for DELETE /api/inventory/storerooms/:id

});