/**
 * Created by: dhayes on 4/8/14.
 * Filename: routes/vendors.js
 */
var logger = require('../logger'),
    mongoose = require('mongoose'),
    config = require('../configuration'),
    auth = require('../configuration/auth'),
    Inventory = mongoose.model('Inventory'),
    elasticsearch = require('elasticsearch');

module.exports = function(app) {
    app.get('/api/inventory/inventories', auth.ensureAuthenticated, function(req, res, next) {
        Inventory.find({}, function(err, vendors) {
            if (err) return next(err);
            res.json(200, vendors);
        });
    });

    app.get('/api/inventory/inventory/new', auth.ensureAuthenticated, function(req, res) {
        res.json(200, new Inventory());
    });

    app.get('/api/inventory/inventories/:id', auth.ensureAuthenticated, function(req, res, next) {
        Inventory.findById(req.params.id, function(err, inventory) {
            if (err) return next(err);
            res.json(200, inventory);
        });
    });

    app.delete('/api/inventory/inventories/:id', auth.ensureAuthenticated, function(req, res, next) {
        var id = req.params.id;
        // note: using findByIdAndRemove bypasses certain lifecycle events
        // Therefore, using the 2 step approach.
        Inventory.findById(id, function(err, inventory) {
            if (err) return next(err);
            inventory.remove(function(err) {
                if (err) return next(err);
                res.json(200);
            });
        });
    });

    app.post('/api/inventory/inventories', auth.ensureAuthenticated, function(req, res, next) {
        Inventory.create(req.body, function(err, newInventory) {
            if (err) return next(err);
            res.json(200, newInventory);
        });
    });

    app.put('/api/inventory/inventories/:id', auth.ensureAuthenticated, function(req, res, next) {
        Inventory.findById(req.params.id, function(err, inventory){
            if (err) return next(err);
            inventory.merge(req.body);

            inventory.save(function(err, updated){
                if (err) return next(err);

                res.json(200, updated);
            });
        });
    });

    app.post('/api/inventory/inventories/_search', function(req, res, next) {
        var client = new elasticsearch.Client({
            host: config.get('elasticsearch:host')
        });
        client.search({
            index: 'inventories',
            type: 'inventory',
            body: req.body
        }).then(function (resp) {
            res.json(200, resp)
        }, function (err) {
            return next(err);
        });
    });

};
