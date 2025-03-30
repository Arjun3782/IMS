const express = require('express');
const { addProduction, getProductions, updateStatus } = require('../Controllers/productionController');
const ensureAuthenticated = require('../Middlewares/AuthMiddlewares/Auth');
const companyFilter = require('../Middlewares/companyFilter');

const router = express.Router();

// Apply authentication and company filter middleware to all routes
router.use(ensureAuthenticated);
router.use(companyFilter);

router.post('/addProduction', addProduction);
router.get('/getProductions', getProductions);
router.put('/updateStatus/:id', updateStatus);

module.exports = router;