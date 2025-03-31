// Check if the route is properly defined with authentication middleware
const express = require('express');
const { addProduct, getProducts, updateProduct, deleteProduct, addCompletedProduction } = require('../Controllers/productController');
const ensureAuthenticated = require('../Middlewares/AuthMiddlewares/Auth');
const companyFilter = require('../Middlewares/companyFilter');

const router = express.Router();

// Apply authentication and company filter middleware to all routes
router.use(ensureAuthenticated);
router.use(companyFilter);

router.post('/addProduct', addProduct);
router.get('/getProducts', getProducts);
router.put('/updateProduct/:id', updateProduct);
router.delete('/deleteProduct/:id', deleteProduct);
router.post('/addCompletedProduction', addCompletedProduction);

module.exports = router;