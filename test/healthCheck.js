/**
 * Created by: dhayes on 4/5/14.
 * Filename: heartbeat
 */
var app = require('../app'),
    request = require('supertest');

describe('storeroom83 healthCheck api', function(){
    describe('when requesting resource /healthCheck', function(){
        it('should respond with 200', function(done){
            request(app).get('/healthCheck')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
});