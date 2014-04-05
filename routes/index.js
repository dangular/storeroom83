/*
 * GET home page.
 */

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
    res.json({
        status: 'OK',
        application: 'Storeroom83',
        version: '0.0.1',
        author: 'dangular'
    });
};