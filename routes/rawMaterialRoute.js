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
router.put('/updateRawMaterial/:id', updateRawMaterial);
router.delete('/deleteRawMaterial/:id', deleteRawMaterial);

module.exports = router;