const express = require('express'); 
const { addRawMaterial, getRawMaterial, updateRawMaterial, deleteRawMaterial } = require('../Controllers/rawMaterialController');
const ensureAuthenticated = require('../Middlewares/AuthMiddlewares/Auth');
const companyFilter = require('../Middlewares/companyFilter');

const router = express.Router();

// Apply authentication and company filter middleware to all routes
router.use(ensureAuthenticated);
router.use(companyFilter);

router.post('/addRawMaterial', addRawMaterial);
router.get('/getRawMaterial', getRawMaterial);
router.put('/updateRawMaterial/:id', updateRawMaterial);
router.delete('/deleteRawMaterial/:id', deleteRawMaterial);

module.exports = router;