/**
 * Created by: dhayes on 4/8/14.
 * Filename: inventory
 */
var logger = require('../lib/logger');

var models = require('../lib/model/inventory');

module.exports = function(app) {
    app.get('/api/inventory/storeroom', function(req, res) {
        models.Storeroom.find({}, function(err, storerooms) {
            if (err) logger.error(err);
            res.json(200, storerooms);
        });
    });

    // other inventory routes here
};
