const express = require('express');
const morgan = require('morgan');
// const { resolve } = require('path');
const app = express();
const errorHandler = require('./util/error-handler');
// const createEnsureAuth = require('./util/ensure-auth');
require('./models/register-plugins');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

const auth = require('./routes/auth');
const songs = require('./routes/songs');
const users = require('./routes/users');
const artists = require('./routes/artists');
const playlists = require('./routes/playlists');
const albums = require('./routes/albums');

app.use('/auth', auth);
app.use('/users', users);
app.use('/albums', albums);
app.use('/artists', artists);
app.use('/songs', songs);
app.use('/playlists', playlists);

app.use(errorHandler());

module.exports = app;