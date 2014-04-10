/**
 * Created by: dhayes on 4/8/14.
 * Filename: inventory
 */
var logger = require('../logger');
var mongoose = require('mongoose');

var storeroomSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    description: String,
    createdOn: { type: Date, default: Date.now }
});

var storeroomModel = mongoose.model('Storeroom', storeroomSchema);

module.exports = {
    Storeroom: storeroomModel
};



