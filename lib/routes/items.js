/**
 * Created by: dhayes on 4/8/14.
 * Filename: routes/items.js
 */
var logger = require('../logger'),
    mongoose = require('mongoose'),
    auth = require('../configuration/auth'),
    Item = mongoose.model('Item');

module.exports = function(app) {
    app.get('/api/inventory/items', auth.ensureAuthenticated, function(req, res, next) {
        Item.find({}, function(err, items) {
            if (err) return next(err);
            res.json(200, items);
        });
    });

    app.get('/api/inventory/items/:id', function(req, res, next) {
        Item.findById(req.params.id, function(err, item) {
            if (err) return next(err);
            res.json(200, item);
        });
    });

    app.delete('/api/inventory/items/:id', function(req, res, next) {
        var id = req.params.id;
        Item.findOneAndRemove({_id: id}, function(err) {
            if (err) return next(err);
            res.json(200);
        });
    });

    app.post('/api/inventory/items', auth.ensureAuthenticated, function(req, res, next) {
        var item = new Item(req.body);
        item.save(function(err, newitem) {
            if (err) return next(err);
            res.json(200, newitem);
        });
    });

    app.put('/api/inventory/items/:id', auth.ensureAuthenticated, function(req, res, next) {
        Item.findById(req.params.id, function(err, item){
            if (err) return next(err);
            item.merge(req.body);

            item.save(function(err, updateditem){
                if (err) return next(err);
                res.json(200, updateditem);
            });
        });
    });

    app.post('/api/inventory/items/_search', function(req, res, next) {
        Item.search(req.body, function(err, items) {
            if (err) return next(err);
            res.json(200, items);
        })
    });

    app.post('/api/inventory/items/_reindex', function(req, res, next) {
        var stream = Item.synchronize();
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
