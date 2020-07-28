const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const server = express();

const errorMiddleware = require('../middleware/error.middleware');

// x-www-form-urlencoded <form></form>
// app.use(bodyParser.urlencoded({ extended: false }));

server.use(bodyParser.json()); // aplication/json
// multer
server.use(require('../middleware/fileMulter.middleware'));
// static path
server.use('/images', express.static(path.join(__dirname, '../images')));

// import cors
server.use(cors());

// module routes import
server.use(require('../routes/index.routes'));

server.use(errorMiddleware);

module.exports = server;
