const { signup, login, refreshToken, logout } = require('../../Controllers/AuthController/AuthController.js');
const { signupValidation, loginValidation } = require('../../middlewares/AuthMiddlewares/AuthValidation');
const ensureAuthenticated = require('../../Middlewares/AuthMiddlewares/Auth');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
// Add a verify token endpoint
router.get('/verify-token', ensureAuthenticated, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;