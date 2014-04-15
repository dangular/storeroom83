/**
 * Created by: dhayes on 4/8/14.
 * Filename: inventory
 */
var logger = require('../logger'),
    mongoose = require('mongoose'),
    merge = require('mongoose-merge-plugin'),
    timestamp = require('mongoose-timestamp');

mongoose.plugin(merge);

var storeroomSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    description: String
});

storeroomSchema.plugin(timestamp);

var storeroomModel = mongoose.model('Storeroom', storeroomSchema);

module.exports = {
    Storeroom: storeroomModel
};



