// routes/orderHistory.js
const express = require('express');
const router = express.Router();
const Order = require('../Model/orderModel');

router.get('/history', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('product', 'name') // only get product name
            .exec();

        // Count how many times each product was ordered
        const productCounts = {};

        orders.forEach(order => {
            if (order.product && order.product.name) {
                const name = order.product.name;
                productCounts[name] = (productCounts[name] || 0) + 1;
            }
        });

        res.status(200).json({ success: true, data: productCounts });
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
