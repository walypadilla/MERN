const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { signupValidation } = require('../middleware/validation.middleware');

router.put('/signup', signupValidation, authController.signup);
router.post('/login', authController.login);

module.exports = router;
