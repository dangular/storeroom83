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
        var storeroom1 = new Storeroom({'name':'CENTRAL', 'description': 'Central Item', 'useInPurchasing': true, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom2 = new Storeroom({'name':'EAST', 'description': 'East Item', 'useInPurchasing': true, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom3 = new Storeroom({'name':'WEST', 'description': 'West Item', 'useInPurchasing': true, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom4 = new Storeroom({'name':'NORTH', 'description': 'North Item', 'useInPurchasing': false, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom5 = new Storeroom({'name':'SOUTH', 'description': 'South Item', 'useInPurchasing': true, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom6 = new Storeroom({'name':'SOUTHWEST', 'description': 'Southwest Item', 'useInPurchasing': true, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom7 = new Storeroom({'name':'NORTHEAST', 'description': 'Northeast Item', 'useInPurchasing': false, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom8 = new Storeroom({'name':'NORTHWEST', 'description': 'Northwest Item', 'useInPurchasing': true, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});
        var storeroom9 = new Storeroom({'name':'SOUTHEAST', 'description': 'Southeast Item', 'useInPurchasing': false, 'controlAccount': '0600-100-1000', 'costAdjAccount': '0600-100-1100', 'receiptVarAccount': '0600-100-1200', 'purchaseVarAccount': '0600-100-1300', 'shrinkageAccount': '0600-100-1400', 'invoiceVarAccount': '0600-100-1500', 'currencyVarAccount': '0600-100-1600'});

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

    grunt.registerTask('addItems', 'Add Items', function() {
        var config = require('../lib/configuration');
        var dbURI = config.get('mongodb:dbURI');
        var mongoose = require('mongoose');
        var path = require('path');
        var csv = require('csv');

        // async mode
        var done = this.async();

        require('../lib/models/items');
        var Item = mongoose.model('Item');

        var items = [];

        csv().from.path(path.join(__dirname,'seed_items.csv'))
            .on('record', function(row){
                //console.log('#'+index+' '+JSON.stringify(row));
                items.push(new Item({
                    partNumber: row[0],
                    commodity: row[1],
                    description: row[2],
                    orderUnitOfMeasure: row[4],
                    issueUnitOfMeasure: row[4]
                }));
            })
            .on('end', function(count){
                console.log('Number of lines: '+count);
                mongoose.connect(dbURI);

                mongoose.connection.on('open', function () {
                    Item.create(items, function(err) {
                        if (err) {
                            console.log(err);
                            mongoose.connection.close(done);
                        } else {
                            console.log('Created Items');
                            mongoose.connection.close(done);
                        }

                    });
                });
            })
            .on('error', function(error){
                console.log(error.message);
                done();
            });


    });

};