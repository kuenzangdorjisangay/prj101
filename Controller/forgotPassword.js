const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/userModel'); // or wherever your User model is
const nodemailer = require('nodemailer');
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const token = jwt.sign(
            { userId: user._id },
            process.env.RESET_PASSWORD_SECRET || 'reset_secret',
            { expiresIn: '15m' }
        );

        const resetLink = `http://localhost:3000/new-password.html?token=${token}`;

       const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Accept self-signed certs
    }
});
        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });

        res.json({ message: 'Reset email sent' });
    } catch (err) {
        console.error('❌ Forgot Password Error:', err); // Log the real issue
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET || 'reset_secret');

        const user = await User.findById(decoded.userId);
        if (!user) return res.status(400).json({ message: 'Invalid token or user not found' });

        user.password = newPassword; // assign plain password
        await user.save(); // pre-save hook hashes it

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};
