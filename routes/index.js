/*
 * GET home page.
 */
var logger = require("../lib/logger"),
    config = require("../lib/configuration");

exports.index = function(req, res){
    res.render('index');
};

exports.partials = function(req, res) {
    var module = req.params.module;
    var partial = req.params.partial;
    res.render('partials/'+module+'/'+partial);
};

exports.heartbeat = function(req, res) {
    res.json(200, 'OK');
};

exports.healthCheck = function (req, res) {
    logger.debug("Health Check called...");
    var appInfo = config.get("application");
    appInfo.status = 'OK';
    res.json(appInfo);
};