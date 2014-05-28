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
        required: true
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

VendorSchema.post('save', function(vendor) {
    var Item = mongoose.model('Item');

    var v = {
        _id: vendor._id,
        code: vendor.code,
        name: vendor.name
    };
    Item.update({'vendorParts.vendor._id': vendor._id}, { $set: { "vendorParts.$.vendor" : v }}, { multi: true}, function(err, updated){
        if (err) {
            logger.error('Error attempting to update item.vendorParts.vendor with updated vendor information: '+err);
            return next(err);
        }
        logger.debug('Updated '+updated+' items with updated vendor information');
    });

});

mongoose.model('Vendor', VendorSchema);





