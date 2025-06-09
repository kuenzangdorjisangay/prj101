const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to the model name in userModel.js
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Refers to the model name in productModel.js
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Pending'
    },
    userName: {
        type: String,
        required: true
    }

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;