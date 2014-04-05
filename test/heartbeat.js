/**
 * Created by: dhayes on 4/5/14.
 * Filename: heartbeat
 */
var app = require('../app'),
    request = require('supertest');

describe('storeroom83 heartbeat api', function(){
    describe('when requesting resource /heartbeat', function(){
        it('should respond with 200', function(done){
            request(app).get('/heartbeat')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
});