const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user.model');
const { SECRET_JWT } = require('../config/config');

exports.signup = async (req, res, next) => {
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
	try {
		const hashedPw = await bcrypt.hash(password, 12);

		const user = new UserModel({
			email: email,
			password: hashedPw,
			name: name,
		});
		const result = await user.save();
		res.status(201).json({ message: 'User created!', userId: result._id });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	let loadUser;
	try {
		const user = await UserModel.findOne({ email: email });
		if (!user) {
			const error = new Error('A user with this email could not found.');
			error.statusCode = 401;
			throw error;
		}
		loadUser = user;

		const IsEqual = await bcrypt.compare(password, user.password);
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
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getUserStatus = async (req, res, next) => {
	try {
		const user = await UserModel.findById(req.userId);
		if (!user) {
			const error = new Error('User not found.');
			error.statusCode = 404;
			throw error;
		}
		res.status(200).json({ status: user.status });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.updateUserStatus = async (req, res, next) => {
	const newStatus = req.body.status;
	try {
		const user = await UserModel.findById(req.userId);
		if (!user) {
			const error = new Error('User not found.');
			error.statusCode = 404;
			throw error;
		}
		user.status = newStatus;
		await user.save();
		res.status(200).json({ message: 'User updated.' });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
