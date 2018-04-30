const express = require('express');
const morgan = require('morgan');
// const { resolve } = require('path');
const app = express();
const errorHandler = require('./util/error-handler');
// const createEnsureAuth = require('./util/ensure-auth');
require('./models/register-plugins');

app.use(morgan('dev'));
app.use(express.json());

const songs = require('./routes/songs');
const artists = require('./routes/artists');
const playlists = require('./routes/playlists');

app.use('/artists', artists);
app.use('/songs', songs);
app.use('/playlists', playlists);

app.use(errorHandler());

module.exports = app;