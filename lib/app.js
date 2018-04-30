const express = require('express');
const morgan = require('morgan');
// const { resolve } = require('path');
const app = express();
const errorHandler = require('./util/error-handler');
// const createEnsureAuth = require('./util/ensure-auth');
require('./models/register-plugins');

app.use(morgan('dev'));
app.use(express.json());

const auth = require('./routes/auth');
const songs = require('./routes/songs');
const users = require('./routes/users');

app.use('/auth', auth);
app.use('/songs', songs);
app.use('/users', users);

app.use(errorHandler());

module.exports = app;