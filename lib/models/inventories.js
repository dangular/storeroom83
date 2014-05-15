/**
 * Created by: dhayes on 4/8/14.
 * Filename: models/storerooms.js
 */
var logger = require('../logger'),
    mongoose = require('mongoose'),
    merge = require('mongoose-merge-plugin'),
    timestamp = require('mongoose-timestamp');

mongoose.plugin(merge);

var InventorySchema = new mongoose.Schema({
    item: {
        _id: { type: mongoose.SchemaTypes.ObjectId},
        partNumber: { type: String },
        description: { type: String }
    },
    storeroom: {
        _id: { type: mongoose.SchemaTypes.ObjectId},
        name: { type: String },
        description: { type: String }
    },
    stockCategory: { type: String, required: true, default: 'STOCK' },
    defaultBin: { type: String },
    abcType: { type: String },
    countFrequency: { type: Number },
    reorderPoint: { type: Number },
    leadTimeDays: { type: Number },
    safetyStock: { type: Number },
    economicOrderQty: { type: Number },
    currentBalance: { type: Number, required: true, default: 0 },
    qtyReserved: { type: Number, required: true, default: 0 },
    expiredQtyInStock: { type: Number, required: true, default: 0 },
    qtyAvailable: { type: Number, required: true, default: 0 },
    qtyInHoldingLocation: { type: Number, required: true, default: 0 }

}, { collection: 'inventories' });

InventorySchema.plugin(timestamp);

InventorySchema.pre('save', function(next) {
    var self = this;
    if (!self.isNew) {
        return next();
    } else {
        mongoose.models["Inventory"].findOne({'item._id' : self.item._id, 'storeroom._id': self.storeroom._id},function(err, inventory) {
            if (err) return next(err);
            if (inventory) {
                return next(new Error("Inventory record already exists for this item and storeroom"));
            } else {
                return next();
            }
        });
    }
});

mongoose.model('Inventory', InventorySchema);





