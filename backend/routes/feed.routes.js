const express = require('express');
const router = express.Router();

const feedController = require('../controllers/feed.controller');
const { feedValidation } = require('../middleware/validation.middleware');
const { validationToken } = require('../middleware/is-auth.middleware');

router.get('/posts', validationToken, feedController.getPosts);
router.post(
	'/post',
	[feedValidation, validationToken],
	feedController.createPost
);
router.get('/post/:postId', validationToken, feedController.getPost);
router.put(
	'/post/:postId',
	[feedValidation, validationToken],
	feedController.updatePost
);
router.delete('/post/:postId', validationToken, feedController.deletePost);

module.exports = router;
