/**
 * Created by: dhayes on 4/8/14.
 * Filename: inventory
 */
var logger = require('../lib/logger'),
    models = require('../lib/model/inventory');

module.exports = function(app) {
    app.get('/api/inventory/storerooms', function(req, res, next) {
        models.Storeroom.find({}, function(err, storerooms) {
            if (err) return next(err);
            res.json(200, storerooms);
        });
    });

    app.get('/api/inventory/storerooms/:id', function(req, res, next) {
        models.Storeroom.findById(req.params.id, function(err, storeroom) {
            if (err) return next(err);
            res.json(200, storeroom);
        });
    });

    app.delete('/api/inventory/storerooms/:id', function(req, res, next) {
        var id = req.params.id;
        models.Storeroom.findOneAndRemove({_id: id}, function(err) {
            if (err) return next(err);
            res.json(200);
        });
    });

    app.post('/api/inventory/storerooms', function(req, res, next) {
        var storeroom = new models.Storeroom(req.body);
        storeroom.save(function(err, newStoreroom) {
            if (err) return next(err);
            res.json(200, newStoreroom);
        });
    });

    app.put('/api/inventory/storerooms/:id', function(req, res, next) {

        models.Storeroom.findById(req.params.id, function(err, storeroom){
            if (err) return next(err);
            storeroom.merge(req.body);

            storeroom.save(function(err, updatedStoreroom){
                if (err) return next(err);
                res.json(200, updatedStoreroom);
            });
        });
    });

    // other inventory routes here
};
