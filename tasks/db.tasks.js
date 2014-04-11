/**
 * Created by: dhayes on 4/9/14.
 * Filename: db.tasks
 */
var mongoose = require('mongoose');

module.exports = function(grunt) {
    grunt.registerTask('dropDatabase', 'Drop the database', function() {

        var config = require('../lib/configuration');
        var dbURI = config.get('mongodb:dbURI');

        mongoose.connect(dbURI);

        // async mode
        var done = this.async();

        mongoose.connection.on('open', function () {
            console.log("connected to mongo ["+dbURI+"]");
            mongoose.connection.db.dropDatabase(function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('Successfully dropped db');
                }
                mongoose.connection.close(done);
            });
        });
    });

    grunt.registerTask('seedDatabase', 'Seed the database', function() {
        var config = require('../lib/configuration');
        var dbURI = config.get('mongodb:dbURI');

        var inventoryModels = require('../lib/model/inventory');

        mongoose.connect(dbURI);

        // async mode
        var done = this.async();

        mongoose.connection.on('open', function () {
            console.log("connected to mongo ["+dbURI+"]");
            var storeroom1 = new inventoryModels.Storeroom({'name':'CENTRAL', 'description': 'Central Storeroom'});
            var storeroom2 = new inventoryModels.Storeroom({'name': 'EAST', 'description': 'East Storeroom'});
            var storeroom3 = new inventoryModels.Storeroom({'name': 'WEST', 'description': 'West Storeroom'});
            var storeroom4 = new inventoryModels.Storeroom({'name': 'NORTH', 'description': 'North Storeroom'});
            var storeroom5 = new inventoryModels.Storeroom({'name': 'SOUTH', 'description': 'South Storeroom'});

            inventoryModels.Storeroom.create([storeroom1, storeroom2, storeroom3, storeroom4, storeroom5], function(err) {
                if (!err) {
                    console.log('Created Storerooms');
                }
                mongoose.connection.close(done);
            });

        });
    });

};