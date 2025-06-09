const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const Order = require('../Model/orderModel');

/**
 * Create multiple orders at once
 * POST /api/orders
 * Requires authentication
 */
const Product = require('../Model/productModel'); // Make sure this is imported

router.post('/', authenticate, async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order data: items required' });
    }

    const ordersToInsert = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const quantity = item.quantity || 1;
      const totalAmount = product.price * quantity;

      ordersToInsert.push({
        user: userId,
        userName: req.user.name,
        product: item.productId,
        quantity,
        status: 'Pending',
        orderDate: new Date(),
        totalAmount // ✅ now saved into the DB
      });
    }

    await Order.insertMany(ordersToInsert);

    res.status(201).json({ success: true, message: 'Orders created successfully' });
  } catch (error) {
    console.error('Error creating orders:', error);
    res.status(500).json({ success: false, message: 'Server error while creating orders' });
  }
});

// GET /api/orders/total-income
router.get('/total-income', authenticate, async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    res.json({ success: true, total: result[0]?.total || 0 });
  } catch (err) {
    res.json({ success: false, message: 'Failed to fetch income' });
  }
});

/**
 * Get all orders for a specific user
 * GET /api/orders/user/:userId
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('product')
      .populate({
        path: 'user',
        select: 'name' // Only include the 'name' field of user
      })
      .exec();

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching orders' });
  }
});

/**
 * Get a single order by order ID
 * GET /api/orders/:orderId
 */
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('product')
      .populate('user')
      .exec();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching order' });
  }
});

/**
 * Optional: Update order status by order ID
 * PATCH /api/orders/:orderId/status
 */
/*
router.patch('/:orderId/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Server error while updating status' });
  }
});
*/

/**
 * Optional: Delete an order by ID
 * DELETE /api/orders/:orderId
 */
/*
router.delete('/:orderId', authenticate, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting order' });
  }
});
*/





module.exports = router;
