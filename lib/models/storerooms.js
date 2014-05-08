/**
 * Created by: dhayes on 4/8/14.
 * Filename: models/storerooms.js
 */
var logger = require('../logger'),
    mongoose = require('mongoose'),
    mongoosastic = require('mongoosastic'),
    merge = require('mongoose-merge-plugin'),
    timestamp = require('mongoose-timestamp');

mongoose.plugin(merge);

var StoreroomSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        es_index: 'not_analyzed'
    },
    description: {
        type: String,
        required: true,
        es_type: 'multi_field',
        es_fields: {
            description: { type: 'string', index: 'analyzed' },
            raw: { type: 'string', index: 'not_analyzed' }
        }
    },
    controlAccount: {type: String, es_index: 'not_analyzed'},
    costAdjAccount: {type: String, es_index: 'not_analyzed'},
    receiptVarAccount: {type: String, es_index: 'not_analyzed'},
    purchaseVarAccount: {type: String, es_index: 'not_analyzed'},
    shrinkageAccount: {type: String, es_index: 'not_analyzed'},
    invoiceVarAccount: {type: String, es_index: 'not_analyzed'},
    currencyVarAccount: {type: String, es_index: 'not_analyzed'},
    useInPurchasing: {type: Boolean, default: true}
});

StoreroomSchema.plugin(timestamp);
StoreroomSchema.plugin(mongoosastic);

StoreroomSchema.pre('save', function(next) {
    var self = this;
    if (!self.isNew) {
        return next();
    } else {
        mongoose.models["Storeroom"].findOne({name : self.name},function(err, storeroom) {
            if (err) return next(err);
            if (storeroom) {
                return next(new Error("Storeroom name must be unique"));
            } else {
                return next();
            }
        });
    }
});

var Storeroom = mongoose.model('Storeroom', StoreroomSchema);

Storeroom.createMapping(function(err, mapping){
    if(err){
        console.log('Could not create mapping for Storeroom.  This may be due to the fact that the mapping may already exist.  To update the mapping, first delete the index.');
    } else {
        console.log('Storeroom mapping created:');
        console.log(mapping);
    }
});




