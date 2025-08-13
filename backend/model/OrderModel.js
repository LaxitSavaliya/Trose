const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    name: String,
    qty: Number,
    price: Number,
    mode: String,
    createdAt: {
        type: String,
        default: () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }
    }
});

const OrderModel = mongoose.model('order', OrderSchema);

module.exports = OrderModel;
