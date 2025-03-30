const express = require('express');
const { addProduct, getProducts, updateProduct, deleteProduct } = require('../Controllers/productController');
const router = express.Router();

router.post('/addProduct', addProduct);
router.get('/getProducts', getProducts);
router.put('/updateProduct/:id', updateProduct);
router.delete('/deleteProduct/:id', deleteProduct);

module.exports = router;