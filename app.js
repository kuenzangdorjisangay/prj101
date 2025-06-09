const express = require('express');
const path = require('path');
const app = express();
const orderRoute = require('./Controller/orderContoller');
const orderListRoute = require('./Controller/fetchOrder');
const orderDetailRoute = require('./Controller/productDetail');
const orderHistoryRoute = require('./Controller/orderHistory');
const userRoutes = require('./routes/userDelete');
const feedbackRoutes = require('./routes/feedback');
const users = require('./routes/user')


const cors = require('cors');
app.use(express.json());
app.use(cors());

require('dotenv').config();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const authRoutes = require('./routes/authRoutes');
const productRoute = require('./routes/productRoute');

// Middleware to parse JSON request bodies
// app.use(express.json());

// Serve static files (optional, if you later add CSS/JS)
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('view'));
// Route to serve register.html from the "views" directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'register.html'));
});
// Serve login.html
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'login.html'));
});
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'home.html'));
});
app.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'login.html'));
});
app.get('/add-product', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'addProduct.html')); // make sure you have this file
});
// Auth API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/orderList', orderListRoute);
app.use('/api/orderDetail', orderDetailRoute);
app.use('/api/orderHistory', orderHistoryRoute);

app.use('/api/feedback', feedbackRoutes);

const sendEmailRoute = require('./routes/orderReady');



//user delete
app.use('/api', userRoutes);

//feedback
app.use('/feedback', feedbackRoutes);

//get total users
app.use('/api/users', users);

//send order ready mail
app.use('/api', sendEmailRoute);

// app.use('/api/auth', forgotPassword);


const jwt = require('jsonwebtoken');





module.exports = app;
