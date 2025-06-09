const express = require('express');
const router = express.Router();
const Order = require('../Model/orderModel');

// GET /api/orderDetail/:orderId
router.get('/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Step 1: Find the reference order
    const refOrder = await Order.findById(orderId).exec();

    if (!refOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Step 2: Get all orders with same userName and orderDate
    const sameTimeOrders = await Order.find({
      userName: refOrder.userName,
      orderDate: refOrder.orderDate // Or use time range if needed
    }).populate('product', 'name price');

    if (sameTimeOrders.length === 0) {
      return res.status(404).json({ success: false, message: 'No related orders found' });
    }

    // Optional: Log missing product references
    sameTimeOrders.forEach(order => {
      if (!order.product) {
        console.warn(`Missing product for orderId: ${order._id}`);
      }
    });

    // Step 3: Build product details list safely
    const productDetails = sameTimeOrders
      .filter(order => order.product) // Skip orders with missing products
      .map(order => ({
        productName: order.product.name,
        quantity: order.quantity,
        price: order.product.price,
        total: order.quantity * order.product.price
      }));

    const subtotal = productDetails.reduce((sum, item) => sum + item.total, 0);
    const packing = 0;
    const grandTotal = subtotal + packing;

    // Final response structure
    const orderDetails = {
      orderGroupId: `${refOrder.userName}-${refOrder.orderDate.toISOString()}`,
      userName: refOrder.userName,
      products: productDetails,
      subtotal,
      packing,
      grandTotal
    };

    res.status(200).json({ success: true, data: orderDetails });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
