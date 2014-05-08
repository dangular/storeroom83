/**
 * Created by: dhayes on 4/8/14.
 * Filename: routes/storerooms.js
 */
var logger = require('../logger'),
    mongoose = require('mongoose'),
    auth = require('../configuration/auth'),
    Storeroom = mongoose.model('Storeroom');

module.exports = function(app) {
    app.get('/api/inventory/storerooms', auth.ensureAuthenticated, function(req, res, next) {
        Storeroom.find({}, function(err, storerooms) {
            if (err) return next(err);
            res.json(200, storerooms);
        });
    });

    app.get('/api/inventory/storerooms/:id', function(req, res, next) {
        Storeroom.findById(req.params.id, function(err, storeroom) {
            if (err) return next(err);
            res.json(200, storeroom);
        });
    });

    app.delete('/api/inventory/storerooms/:id', function(req, res, next) {
        var id = req.params.id;
        // note: using findByIdAndRemove bypasses certain lifecycle events
        // which means the mongoosastic plugin won't remove it from the elasticsearch index
        // Therefore, using the 2 step approach.
        Storeroom.findById(id, function(err, storeroom) {
            if (err) return next(err);
            storeroom.remove(function(err) {
                if (err) return next(err);
                res.json(200);
            });
        });
    });

    app.post('/api/inventory/storerooms', auth.ensureAuthenticated, function(req, res, next) {
        var storeroom = new Storeroom(req.body);
        storeroom.save(function(err, newStoreroom) {
            if (err) return next(err);
            res.json(200, newStoreroom);
        });
    });

    app.put('/api/inventory/storerooms/:id', auth.ensureAuthenticated, function(req, res, next) {
        Storeroom.findById(req.params.id, function(err, storeroom){
            if (err) return next(err);
            storeroom.merge(req.body);

            storeroom.save(function(err, updatedStoreroom){
                if (err) return next(err);
                res.json(200, updatedStoreroom);
            });
        });
    });

    app.post('/api/inventory/storerooms/_search', function(req, res, next) {
        Storeroom.search(req.body, function(err, items) {
            if (err) return next(err);
            res.json(200, items);
        })
    });

    app.post('/api/inventory/storerooms/_reindex', function(req, res, next) {
        var stream = Storeroom.synchronize();
        var count = 0;

        stream.on('data', function(err){
            if (err) return next(err);
            count++;
        });
        stream.on('close', function(){
            res.json(200, {count: count});
        });
        stream.on('error', function(err){
            return next(err);
        });
    });


};
