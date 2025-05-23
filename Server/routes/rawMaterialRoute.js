const express = require('express');
const router = express.Router();
const {
  addRawMaterial,
  getRawMaterial,
  updateRawMaterial,
  deleteRawMaterial
} = require('../Controllers/rawMaterialController');
const { authMiddleware } = require('../middlewares/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Raw material routes
router.post('/addRawMaterial', addRawMaterial);
router.get('/getRawMaterial', getRawMaterial);
// Add this route to match what's being used in Dashboard.jsx
router.get('/getRawMaterials', getRawMaterial); // Using the same controller function
router.put('/updateRawMaterial/:id', updateRawMaterial);
router.delete('/deleteRawMaterial/:id', deleteRawMaterial);

module.exports = router;