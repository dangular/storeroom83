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