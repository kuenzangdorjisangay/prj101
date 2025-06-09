// routes/sendEmail.js
const express = require('express');
const router = express.Router();
const Order = require('../Model/orderModel');
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter (example with Gmail SMTP)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password or app password
    },
    tls: {
        rejectUnauthorized: false, // accept self-signed certs if needed
    },
});

router.post('/sendOrderReadyEmail', async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({ success: false, message: 'Order ID is required' });
        }

        // Fetch order and user info
        const order = await Order.findById(orderId).populate('user', 'email name');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const userEmail = order.user?.email;
        const userName = order.user?.name || order.userName || 'Customer';

        if (!userEmail) {
            return res.status(400).json({ success: false, message: 'User email not found' });
        }

        // Compose email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Your order is ready!',
            text: `Hello ${userName},\n\nYour order with ID ${orderId} is now ready for pickup. Thank you for choosing us!\n\nBest regards,\nGCIT Smart Canteen`,
        };

        // **Send the email!**
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Notification email sent successfully.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

module.exports = router;
