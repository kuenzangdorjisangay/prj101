
const express = require('express');
const router = express.Router();
const User = require('../Model/userModel');


// In routes/userRoutes.js or similar
router.get('/count', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.json({ success: true, count: userCount });
    } catch (error) {
        console.error('Error fetching user count:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router