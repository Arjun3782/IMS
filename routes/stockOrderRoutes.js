const express = require('express');
const router = express.Router();
const { verifyToken } = require('../Middlewares/verifyToken'); // Updated path to Middlewares folder
const stockOrderController = require('../controllers/stockOrderController');

// Get all stock orders
router.get('/getStockOrders', verifyToken, stockOrderController.getStockOrders);

// Add a new stock order
router.post('/addStockOrder', verifyToken, stockOrderController.addStockOrder);

// Update a stock order
router.put('/updateStockOrder/:id', verifyToken, stockOrderController.updateStockOrder);

// Delete a stock order
router.delete('/deleteStockOrder/:id', verifyToken, stockOrderController.deleteStockOrder);

module.exports = router;