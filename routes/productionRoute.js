const express = require('express');
const router = express.Router();
const {
  addProduction,
  getProductions,
  getProductionById,
  updateProduction,
  deleteProduction
} = require('../Controllers/productionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Production routes
router.post('/addProduction', addProduction);
router.get('/getProductions', getProductions);
router.get('/getProduction/:id', getProductionById);
router.put('/updateProduction/:id', updateProduction);
router.delete('/deleteProduction/:id', deleteProduction);

module.exports = router;