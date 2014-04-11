/**
 * Created by: dhayes on 4/9/14.
 * Filename: inventory
 */
var app = require('../app'),
    should = require('should'),
    request = require('supertest');

describe('inventory routes', function(){
    describe('when requesting resource /api/inventory/storerooms', function(){
        it('should respond with 200', function(done){
            request(app).get('/api/inventory/storerooms')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    var results = JSON.parse(res.text);
                    results.length.should.equal(5);
                    done();
                });
        });
    });

    // test for GET /api/inventory/storerooms/:id

    // test for DELETE /api/inventory/storerooms/:id

});