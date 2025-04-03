const express = require('express');
const router = express.Router();
const {
  addRawMaterial,
  getRawMaterial,
  updateRawMaterial,
  deleteRawMaterial
} = require('../Controllers/rawMaterialController');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Raw material routes
router.post('/addRawMaterial', addRawMaterial);
router.get('/getRawMaterial', getRawMaterial);
// Add this route to match the endpoint used in Dashboard.jsx
router.get('/getRawMaterials', getRawMaterial); // Using the same controller function
router.put('/updateRawMaterial/:id', updateRawMaterial);
router.delete('/deleteRawMaterial/:id', deleteRawMaterial);

module.exports = router;