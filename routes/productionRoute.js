const express = require('express');
const { addProduction, getProductions, updateStatus } = require('../Controllers/productionController');
const router = express.Router();

router.post('/addProduction', addProduction);
router.get('/getProductions', getProductions);
router.put('/updateStatus/:id', updateStatus);

module.exports = router;