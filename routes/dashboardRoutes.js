const express = require('express');
const router = express.Router();
const dashboardController = require('../Controllers/dashboardController');
const ensureAuthenticated = require('../Middlewares/AuthMiddlewares/Auth');
const companyFilter = require('../Middlewares/companyFilter');

// Apply authentication and company filter middleware
router.use(ensureAuthenticated);
router.use(companyFilter);

// Get all dashboard statistics in a single call
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;