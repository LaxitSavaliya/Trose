const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    name: String,
    initialprice: Number,
    price: Number
});

const StockModel = mongoose.model('stock', StockSchema);

module.exports = StockModel;