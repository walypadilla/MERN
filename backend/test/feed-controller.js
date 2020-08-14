const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const UserModel = require('../models/user.model');
const FeedController = require('../controllers/feed.controller');
const { MONGO_URI } = require('../config/config');

describe('Feed Controller', function () {
	before(function (done) {
		mongoose
			.connect(MONGO_URI)
			.then((result) => {
				const user = new UserModel({
					email: 'test@test.com',
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

	beforeEach(function () {});

	afterEach(function () {});

	it('should add a created post to the posts of the creator', function (done) {
		const req = {
			body: {
				title: 'Test Post',
				content: 'A Test Post',
			},
			file: {
				path: 'abc',
			},
			userId: '5c0f66b979af55031b34728a',
		};
		const res = {
			status: function () {
				return this;
			},
			json: function () {},
		};

		FeedController.createPost(req, res, () => {}).then((savedUser) => {
			expect(savedUser).to.have.property('posts');
			expect(savedUser.posts).to.have.length(1);
			done();
		});
	});

	after(function (done) {
		UserModel.deleteMany({})
			.then(() => {
				return mongoose.disconnect();
			})
			.then(() => {
				done();
			});
	});
});
