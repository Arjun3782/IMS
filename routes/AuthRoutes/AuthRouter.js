const { signup, login, refreshToken, logout } = require('../../Controllers/AuthController/AuthController.js');
const { signupValidation, loginValidation } = require('../../middlewares/AuthMiddlewares/AuthValidation');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

module.exports = router;