/**
 * Created by: dhayes on 4/8/14.
 * Filename: routes/index.js
 */
'use strict';

var logger = require('../logger'),
    config = require('../configuration');

module.exports = function(app) {

    app.get('/heartbeat', function(req, res) {
        res.json(200, 'OK');
    });
    app.get('/healthCheck', function (req, res) {
        logger.debug("Health Check called...");
        var appInfo = config.get("application");
        appInfo.status = 'OK';
        res.json(appInfo);
    });

    require('./session')(app);
    require('./users')(app);
    require('./storerooms')(app);
    require('./items')(app);
    require('./vendors')(app);
    require('./inventories')(app);
    //other module routes imported here
};