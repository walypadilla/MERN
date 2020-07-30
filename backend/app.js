const server = require('./server/server');
const mongoose = require('mongoose');

const { PORT, MONGO_URI } = require('./config/config');

mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		const app = server.listen(PORT, () => {
			console.log('Running in port: ', PORT);
		});
		const io = require('./server/socket').init(app);
		io.on('connection', (socket) => {
			console.log('Client connected');
		});
	})
	.catch((err) => {
		console.log(err);
	});
