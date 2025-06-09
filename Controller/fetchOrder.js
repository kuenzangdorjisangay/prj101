const express = require('express');
const router = express.Router();
const Order = require('../Model/orderModel');

router.get('/user-summary', async (req, res) => {
  try {
    // Fetch all orders with related product and user data
    const orders = await Order.find()
      .populate('product', 'name price')
      .populate('user', 'name') // Populate user.name if available
      .exec();

    const userOrdersMap = {};

    orders.forEach(order => {
      const userName = order.user?.name || order.userName || 'Unknown User';

      if (!userOrdersMap[userName]) {
        userOrdersMap[userName] = {
          userName,
          orders: [],
          totalPrice: 0,
        };
      }

      // Skip orders without valid product
      if (!order.product) return;

      const orderTotal = order.product.price * order.quantity;

      userOrdersMap[userName].orders.push({
        orderId: order._id,
        productName: order.product.name,
        quantity: order.quantity,
        price: order.product.price,
        orderTotal,
        orderDate: new Date(order.orderDate), // Use Date object for sorting
      });

      userOrdersMap[userName].totalPrice += orderTotal;
    });

    // Sort each user's orders by orderDate ascending (earliest first)
    for (const userData of Object.values(userOrdersMap)) {
      userData.orders.sort((a, b) => a.orderDate - b.orderDate);

      // Convert orderDate back to ISO string for JSON response
      userData.orders = userData.orders.map(order => ({
        ...order,
        orderDate: order.orderDate.toISOString(),
      }));
    }

    const userOrdersArray = Object.values(userOrdersMap);

    res.status(200).json({
      success: true,
      data: userOrdersArray,
    });
  } catch (error) {
    console.error('Error fetching user-wise order summary:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
