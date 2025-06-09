const express = require('express');
const router = express.Router();
const productController = require('../Controller/productController');

// Routes
router.get('/get', productController.getProducts);
router.post('/add', productController.addProduct);
router.put('/update/:id', productController.updateProduct);
router.delete('/delete/:id', productController.deleteProduct);

module.exports = router;
