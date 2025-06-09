const User = require('../Model/userModel');
const jwt = require('jsonwebtoken');

exports.getUserProfile = async (req, res) => {
    try {
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.SECRET_CODE || 'your_jwt_secret_key');
        const userId = decoded.userId;

        const user = await User.findById(userId).select('name email profilePicture');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            success: true,
            data: {
                userName: user.name,
                email: user.email,
                profileImage: user.profilePicture || 'https://placehold.co/90x90?text=User'
            }
        });
    } catch (error) {
        console.error('Failed to get user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
