const User = require('../Model/userModel');
const bcrypt = require('bcrypt'); // ✅ Required for password comparison
const jwt = require('jsonwebtoken');


exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, termsAccepted, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    if (!termsAccepted) {
      return res.status(400).json({ message: 'You must accept the terms and conditions.' });
    }

    // ✅ Create user with raw password and confirmPassword
    const newUser = new User({
      name,
      email,
      password,
      termsAccepted,
      role
    });

    // ✅ Set the virtual field for confirmPassword
    newUser.confirmPassword = confirmPassword;

    await newUser.save();

    res.status(201).json({
      role: newUser.role,
      message: 'User registered successfully'
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    // In loginUser:
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email, name: user.name }, // include name here!
      process.env.SECRET_CODE || 'your_jwt_secret_key',
      { expiresIn: '1h' }
    );


    // Send token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'strict'
    });

    console.log('role is:', user.role)
    // Also send token in response body!
    res.status(200).json({ message: 'Login successful', token, role: user.role, userId: user._id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};