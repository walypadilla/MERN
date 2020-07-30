const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { validationToken } = require('../middleware/is-auth.middleware');
const {
	signupValidation,
	statusValidation,
} = require('../middleware/validation.middleware');

router.put('/signup', signupValidation, authController.signup);
router.post('/login', authController.login);
router.get('/status', validationToken, authController.getUserStatus);
router.patch(
	'/status',
	[statusValidation, validationToken],
	authController.updateUserStatus
);

module.exports = router;
