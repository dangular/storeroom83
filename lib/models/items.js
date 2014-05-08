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

var ItemSchema = new mongoose.Schema({
    partNumber: {
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
    commodity: {
        type: String
    },
    orderUnitOfMeasure: {type: String, es_index: 'not_analyzed' },
    issueUnitOfMeasure: {type: String, es_index: 'not_analyzed' },
    rotating: {type: Boolean, default: false},
    kit: {type: Boolean, default: false},
    capitalized: {type: Boolean, default: false},
    conditionEnabled: {type: Boolean, default: false},
    inspectOnReceipt: {type: Boolean, default: false}
});

ItemSchema.plugin(timestamp);
ItemSchema.plugin(mongoosastic);

ItemSchema.pre('save', function(next) {
    var self = this;
    if (!self.isNew) {
        return next();
    } else {
        mongoose.models["Item"].findOne({partNumber : self.partNumber},function(err, item) {
            if (err) return next(err);
            if (item) {
                return next(new Error("Item part number must be unique"));
            } else {
                return next();
            }
        });
    }
});

var Item = mongoose.model('Item', ItemSchema);

Item.createMapping(function(err, mapping){
    if(err){
        console.log('Could not create mapping for Item.  This may be due to the fact that the mapping may already exist.  To update the mapping, first delete the index.');
    } else {
        console.log('Item mapping created:');
        console.log(mapping);
    }
});





