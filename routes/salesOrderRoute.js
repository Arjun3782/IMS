const express = require('express');
const router = express.Router();
const {
  createSalesOrder,
  getSalesOrders,
  getSalesOrderById,
  updateSalesOrder,
  deleteSalesOrder
} = require('../Controllers/salesOrderController');
const ensureAuthenticated = require('../Middlewares/AuthMiddlewares/Auth');
const companyFilter = require('../Middlewares/companyFilter');

// Apply authentication and company filter middleware to all routes
router.use(ensureAuthenticated);
router.use(companyFilter);

// Sales order routes
router.post('/createSalesOrder', createSalesOrder);
router.get('/getSalesOrders', getSalesOrders);
router.get('/getSalesOrder/:id', getSalesOrderById);
router.put('/updateSalesOrder/:id', updateSalesOrder);
router.delete('/deleteSalesOrder/:id', deleteSalesOrder);

module.exports = router;