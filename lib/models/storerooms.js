/**
 * Created by: dhayes on 4/8/14.
 * Filename: models/storerooms.js
 */
var logger = require('../logger'),
    mongoose = require('mongoose'),
    merge = require('mongoose-merge-plugin'),
    timestamp = require('mongoose-timestamp');

mongoose.plugin(merge);

var StoreroomSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    controlAccount: {type: String},
    costAdjAccount: {type: String},
    receiptVarAccount: {type: String},
    purchaseVarAccount: {type: String},
    shrinkageAccount: {type: String},
    invoiceVarAccount: {type: String},
    currencyVarAccount: {type: String},
    useInPurchasing: {type: Boolean, default: true}
});

StoreroomSchema.plugin(timestamp);

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

StoreroomSchema.post('save', function(storeroom) {
    var Inventory = mongoose.model('Inventory');

    var s = {
        _id: storeroom._id,
        name: storeroom.name,
        description: storeroom.description
    };
    Inventory.update({'storeroom._id': storeroom._id}, { $set: { "storeroom" : s }}, { multi: true}, function(err, updated){
        if (err) {
            logger.error('Error attempting to update inventory.storeroom with updated storeroom information: '+err);
            return next(err);
        }

        logger.debug('Updated '+updated+' inventory with updated storeroom information');
    });
});


mongoose.model('Storeroom', StoreroomSchema);





