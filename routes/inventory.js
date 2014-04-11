/**
 * Created by: dhayes on 4/8/14.
 * Filename: inventory
 */
var logger = require('../lib/logger');

var models = require('../lib/model/inventory');

module.exports = function(app) {
    app.get('/api/inventory/storerooms', function(req, res) {
        models.Storeroom.find({}, function(err, storerooms) {
            if (err) return next(err);
            res.json(200, storerooms);
        });
    });

    app.get('/api/inventory/storerooms/:id', function(req, res) {
        models.Storeroom.findOne({_id: req.params.id}, function(err, storeroom) {
            if (err) return next(err);
            res.json(200, storeroom);
        });
    });

    app.delete('/api/inventory/storerooms/:id', function(req, res) {
        var id = req.params.id;
        models.Storeroom.findOneAndRemove({_id: id}, function(err) {
            if (err) return next(err);
            res.json(200);
        });
    });

    // other inventory routes here
};
