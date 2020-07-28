const server = require('./server/server');
const mongoose = require('mongoose');

const { PORT, MONGO_URI } = require('./config/config');

mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		server.listen(PORT, () => {
			console.log('Running in port: ', PORT);
		});
		console.log('Connection');
	})
	.catch((err) => {
		console.log(err);
	});
