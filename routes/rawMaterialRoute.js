const express = require('express'); 
const { addRawMaterial, getRawMaterial, updateRawMaterial, deleteRawMaterial } = require('../controllers/rawMaterialController');
const router = express.Router();
router.post('/addRawMaterial', addRawMaterial);
router.get('/getRawMaterial', getRawMaterial);
router.put('/updateRawMaterial/:id', updateRawMaterial);
router.delete('/deleteRawMaterial/:id', deleteRawMaterial);
module.exports = router;