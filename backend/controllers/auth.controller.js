const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user.model');
const { SECRET_JWT } = require('../config/config');

exports.signup = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.statusCode = 422;
		error.data = errors.array();
		throw error;
	}
	const email = req.body.email;
	const name = req.body.name;
	const password = req.body.password;
	bcrypt
		.hash(password, 12)
		.then((hashedPw) => {
			const user = new UserModel({
				email: email,
				password: hashedPw,
				name: name,
			});
			return user.save();
		})
		.then((result) => {
			res.status(201).json({ message: 'User created!', userId: result._id });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.login = (req, res, next) => {
	const { email, password } = req.body;
	UserModel.findOne({ email: email })
		.then((user) => {
			if (!user) {
				const error = new Error('A user with this email could not found.');
				error.statusCode = 401;
				throw error;
			}
			loadUser = user;
			return bcrypt.compare(password, user.password);
		})
		.then((IsEqual) => {
			if (!IsEqual) {
				const error = new Error('Wrong password!');
				error.statusCode = 401;
				throw error;
			}
			// create token
			const token = jwt.sign(
				{
					email: loadUser.email,
					userId: loadUser._id.toString(),
				},
				SECRET_JWT,
				{ expiresIn: '2h' }
			);
			res.status(200).json({ token: token, userId: loadUser._id.toString() });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};
