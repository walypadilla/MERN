const expect = require('chai').expect;
const sinon = require('sinon');
const moongose = require('mongoose');

const UserModel = require('../models/user.model');
const AuthController = require('../controllers/auth.controller');
const { MONGO_URI } = require('../config/config');

describe('Auth Controller ', function () {
	before(function () {
		moongose
			.connect(MONGO_URI)
			.then((result) => {
				const user = new UserModel({
					email: 'test@gmail.com',
					password: 'tester',
					name: 'Test',
					posts: [],
					_id: '5c0f66b979af55031b34728a',
				});
				return user.save();
			})
			.then(() => {
				done();
			});
	});

	it('Should throw an error with code 500, if accesing the database fails', function () {
		sinon.stub(UserModel, 'findOne');
		UserModel.findOne.throws();

		const req = {
			body: {
				email: 'test@gmail.com',
				password: 'test',
			},
		};

		AuthController.login(req, {}, () => {}).then((result) => {
			expect(result).to.be.an('error');
			expect(result).to.have.property('statusCode', 500);
		});

		UserModel.findOne.restore();
	});

	beforeEach(function () {});

	afterEach(function () {});

	it('Should send a response with a valid user status for an existing', function () {
		const req = { userId: '5c0f66b979af55031b34728a' };
		const res = {
			statusCode: 500,
			userStatus: null,
			status: function (code) {
				this.statusCode = code;
				return this;
			},
			json: function (data) {
				this.userStatus = data.status;
			},
		};
		AuthController.getUserStatus(req, res, () => {}).then(() => {
			expect(res.statusCode).to.be.equal(200);
			expect(res.statusCode).to.be.equal('I am new!');
			done();
		});
	});

	after(function () {
		UserModel.deleteMany({}).then(() => {
			return moongose.disconnect().then(() => {
				done();
			});
		});
	});
});
