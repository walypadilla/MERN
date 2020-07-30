const { v4: uuidv4 } = require('uuid');
const path = require('path');
const multer = require('multer');
const express = require('express');
const { fs } = require('fs');

const app = express();

const fileStorage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images');
	},
	filename: (req, file, callback) => {
		callback(null, uuidv4() + '-' + file.originalname);
	},
});
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

module.exports = app;
