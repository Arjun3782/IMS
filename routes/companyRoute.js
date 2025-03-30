const express = require('express');
const { 
  createCompany, 
  getAllCompanies, 
  getCompanyById, 
  updateCompany, 
  deleteCompany 
} = require('../Controllers/companyController');
const ensureAuthenticated = require('../Middlewares/AuthMiddlewares/Auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(ensureAuthenticated);

// Company routes
router.post('/create', createCompany);
router.get('/all', getAllCompanies);
router.get('/:id', getCompanyById);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

module.exports = router;