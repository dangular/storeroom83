/**
 * Created by: dhayes on 4/8/14.
 * Filename: routes/vendors.js
 */
var logger = require('../logger'),
    mongoose = require('mongoose'),
    config = require('../configuration'),
    auth = require('../configuration/auth'),
    Vendor = mongoose.model('Vendor'),
    elasticsearch = require('elasticsearch');

module.exports = function(app) {
    app.get('/api/purchasing/vendors', auth.ensureAuthenticated, function(req, res, next) {
        Vendor.find({}, function(err, vendors) {
            if (err) return next(err);
            res.json(200, vendors);
        });
    });

    app.get('/api/purchasing/vendors/new', auth.ensureAuthenticated, function(req, res) {
        res.json(200, new Vendor());
    });

    app.get('/api/purchasing/vendors/:id', auth.ensureAuthenticated, function(req, res, next) {
        Vendor.findById(req.params.id, function(err, vendor) {
            if (err) return next(err);
            res.json(200, vendor);
        });
    });

    app.delete('/api/purchasing/vendors/:id', auth.ensureAuthenticated, function(req, res, next) {
        var id = req.params.id;
        // note: using findByIdAndRemove bypasses certain lifecycle events
        // which means the mongoosastic plugin won't remove it from the elasticsearch index
        // Therefore, using the 2 step approach.
        Vendor.findById(id, function(err, vendor) {
            if (err) return next(err);
            vendor.remove(function(err) {
                if (err) return next(err);
                res.json(200);
            });
        });
    });

    app.post('/api/purchasing/vendors', auth.ensureAuthenticated, function(req, res, next) {
        Vendor.create(req.body, function(err, newVendor) {
            if (err) return next(err);
            res.json(200, newVendor);
        });
    });

    app.put('/api/purchasing/vendors/:id', auth.ensureAuthenticated, function(req, res, next) {
        Vendor.findById(req.params.id, function(err, vendor){
            if (err) return next(err);
            vendor.merge(req.body);

            vendor.save(function(err, updatedVendor){
                if (err) return next(err);
                res.json(200, updatedVendor);
            });
        });
    });

    app.post('/api/purchasing/vendors/_search', function(req, res, next) {
        var client = new elasticsearch.Client({
            host: config.get('elasticsearch:host')
        });
        client.search({
            index: 'vendors',
            type: 'vendor',
            body: req.body
        }).then(function (resp) {
            res.json(200, resp)
        }, function (err) {
            return next(err);
        });
    });

};
