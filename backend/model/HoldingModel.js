const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema({
    name: String,
    qty: Number,
    avg: Number,
    price: Number
});

const HoldingModel = mongoose.model('holding', HoldingSchema);

module.exports = HoldingModel;