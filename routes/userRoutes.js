const express = require('express');
const router = express.Router();
const {
  getUsers,
  register,
  updateUser,
  deleteUser
} = require('../Controllers/userController');
const ensureAuthenticated = require('../Middlewares/AuthMiddlewares/Auth');
const adminCheck = require('../Middlewares/adminCheck');

// Apply authentication middleware to all routes
router.use(ensureAuthenticated);

// User management routes
router.get('/getUsers/:companyId', getUsers);
router.post('/register', register);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);

module.exports = router;