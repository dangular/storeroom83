/**
 * Created by: dhayes on 4/8/14.
 * Filename: models/storerooms.js
 */
var logger = require('../logger'),
    mongoose = require('mongoose'),
    merge = require('mongoose-merge-plugin'),
    timestamp = require('mongoose-timestamp');

mongoose.plugin(merge);

var VendorSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true,
        es_type: 'multi_field',
        es_fields: {
            name: { type: 'string', index: 'analyzed' },
            raw: { type: 'string', index: 'not_analyzed' }
        }
    },
    active: {type: Boolean, default: true}
});

VendorSchema.plugin(timestamp);

VendorSchema.pre('save', function(next) {
    var self = this;
    if (!self.isNew) {
        return next();
    } else {
        mongoose.models["Vendor"].findOne({code : self.code},function(err, vendor) {
            if (err) return next(err);
            if (vendor) {
                return next(new Error("Vendor code must be unique"));
            } else {
                return next();
            }
        });
    }
});

var Vendor = mongoose.model('Vendor', VendorSchema);





