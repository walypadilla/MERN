const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const { validationToken } = require('../middleware/is-auth.middleware');

describe('Auth middleware', function () {
	it('Should throw an error if no authorization header is present', function () {
		const req = {
			get: function (headerName) {
				return null;
			},
		};

		expect(validationToken.bind(this, req, {}, () => {})).to.throw(
			'Not authenticated'
		);
	});

	it('Should throw an error if the authorization header is only one string', function () {
		const req = {
			get: function (headerName) {
				return 'kksdks';
			},
		};

		expect(validationToken.bind(this, req, {}, () => {})).to.throw();
	});

	it('Should yield a userId after decoding the token', function () {
		const req = {
			get: function (headerName) {
				return 'Bearer kksdks4545444545';
			},
		};
		sinon.stub(jwt, 'verify');

		jwt.verify.returns({ userId: 'abc' });
		validationToken(req, {}, () => {});
		expect(req).to.have.property('userId');
		expect(req).to.have.property('userId', 'abc');
		expect(jwt.verify.called).to.be.true;
		jwt.verify.restore();
	});

	it('Should throw an error if the token cannot be verified', function () {
		const req = {
			get: function (headerName) {
				return 'Bearer kksdks';
			},
		};
		expect(validationToken.bind(this, req, {}, () => {})).to.throw();
	});
});
