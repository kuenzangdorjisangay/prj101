// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../Controller/authController');
const { forgotPassword, resetPassword } = require('../Controller/forgotPassword')
const { getUserProfile } = require('../Controller/profile'); // import the profile controller
const {changePassword} = require('../Controller/changePassword')

const authenticateToken = require('../middleware/profileMiddleware');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.post('/forgot-password', forgotPassword);   // User submits email
router.post('/reset-password', resetPassword);     // User submits new password + token

router.get('/profile', getUserProfile);
router.post('/change-password', authenticateToken, changePassword);




module.exports = router;
