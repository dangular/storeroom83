/**
 * Created by: dhayes on 4/9/14.
 * Filename: inventory
 */
var app = require('../app'),
    should = require('should'),
    request = require('supertest');

describe('inventory routes', function(){
    describe('when requesting resource /api/inventory/storeroom', function(){
        it('should respond with 200', function(done){
            request(app).get('/api/inventory/storeroom')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    var results = JSON.parse(res.text);
                    results.length.should.equal(3);
                    done();
                });
        });
    });
});