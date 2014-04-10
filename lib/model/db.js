/**
 * Created by: dhayes on 4/6/14.
 * Filename: db
 */
var mongoose = require('mongoose');
var config = require('../configuration');
var logger = require('../logger');

var dbURI = config.get('mongodb:dbURI');

mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
    logger.info('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
    logger.error('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
    logger.info('Mongoose disconnected');
});

process.on('SIGINT', function(){
    mongoose.connection.close(function() {
        logger.info('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

module.exports = mongoose;


