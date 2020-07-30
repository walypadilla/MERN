const { body } = require('express-validator');

const UserModel = require('../models/user.model');

let feedValidation = [
	body('title').trim().isLength({ min: 5 }),
	body('content').trim().isLength({ min: 5 }),
];

let signupValidation = [
	body('email')
		.isEmail()
		.withMessage('Please enter a valid email.')
		.custom((value, { req }) => {
			return UserModel.findOne({ email: value }).then((userDoc) => {
				if (userDoc) {
					return Promise.reject('E-Mail address already exists!');
				}
			});
		})
		.normalizeEmail(),
	body('password').trim().isLength({ min: 5 }),
	body('name').trim().not().isEmpty(),
];

let statusValidation = [body('status').trim().not().isEmpty()];
module.exports = {
	feedValidation,
	signupValidation,
	statusValidation,
};
