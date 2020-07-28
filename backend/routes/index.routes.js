const express = require('express');

const app = express();

const feedRoutes = require('../routes/feed.routes');
const authRoutes = require('../routes/auth.routes');
const { feedValidation } = require('../middleware/validation.middleware');

app.use('/feed', feedValidation, feedRoutes);
app.use('/auth', authRoutes);

module.exports = app;
