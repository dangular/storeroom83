/**
 * Created by: dhayes on 4/9/14.
 * Filename: db.tasks
 */


module.exports = function(grunt) {
    grunt.registerTask('dropDatabase', 'Drop the database', function() {
        var config = require('../lib/configuration');
        var dbURI = config.get('mongodb:dbURI');
        var mongoose = require('mongoose');

        // async mode
        var done = this.async();

        mongoose.connect(dbURI);

        mongoose.connection.on('open', function () {
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

    grunt.registerTask('addUsers', 'create users', function() {
        var config = require('../lib/configuration');
        var dbURI = config.get('mongodb:dbURI');
        var mongoose = require('mongoose');

        // async mode
        var done = this.async();

        mongoose.connect(dbURI);

        require('../lib/models/user');

        var User = mongoose.model('User');

        var user = new User({username:'admin',password:'admin',email:'admin@storeroom83.com',firstName:'Admin',lastName:'Administrator'});

        mongoose.connection.on('open', function () {
            console.log("in create users");
            user.save(function(err) {
                if(err) {
                    console.log('Error: ' + err);
                    mongoose.connection.close(done);
                } else {
                    console.log('saved user: ' + user.username);
                    mongoose.connection.close(done);
                }

            });
        });

    });

    grunt.registerTask('addStorerooms','create storerooms', function() {
        var config = require('../lib/configuration');
        var dbURI = config.get('mongodb:dbURI');
        var mongoose = require('mongoose');

        // async mode
        var done = this.async();

        mongoose.connect(dbURI);

        require('../lib/models/storerooms');

        var Storeroom = mongoose.model('Storeroom');
        var storeroom1 = new Storeroom({'name':'CENTRAL', 'description': 'Central Storeroom', 'useInPurchasing': true, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom2 = new Storeroom({'name':'EAST', 'description': 'East Storeroom', 'useInPurchasing': true, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom3 = new Storeroom({'name':'WEST', 'description': 'West Storeroom', 'useInPurchasing': true, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom4 = new Storeroom({'name':'NORTH', 'description': 'North Storeroom', 'useInPurchasing': false, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom5 = new Storeroom({'name':'SOUTH', 'description': 'South Storeroom', 'useInPurchasing': true, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom6 = new Storeroom({'name':'SOUTHWEST', 'description': 'Southwest Storeroom', 'useInPurchasing': true, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom7 = new Storeroom({'name':'NORTHEAST', 'description': 'Northeast Storeroom', 'useInPurchasing': false, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom8 = new Storeroom({'name':'NORTHWEST', 'description': 'Northwest Storeroom', 'useInPurchasing': true, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom9 = new Storeroom({'name':'SOUTHEAST', 'description': 'Southeast Storeroom', 'useInPurchasing': false, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});

        mongoose.connection.on('open', function () {
            Storeroom.create([storeroom1, storeroom2, storeroom3, storeroom4, storeroom5, storeroom6, storeroom7, storeroom8, storeroom9], function(err) {
                if (err) {
                    console.log(err);
                    mongoose.connection.close(done);
                } else {
                    console.log('Created Storerooms');
                    mongoose.connection.close(done);
                }

            });
        });

     });

};