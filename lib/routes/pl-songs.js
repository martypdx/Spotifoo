const router = require('express').Router();
const Playlist = require('../models/Playlist');
const { getParam, respond } = require('./route-helpers');
const createEnsureAuth = require('../util/ensure-auth');
const ensureAuth = createEnsureAuth();

module.exports = router

    .param('plSongId', getParam)

    .post('/', ensureAuth, respond(
        ({ id, body, user }) => Playlist.addPlSong(id, body, user)
    ))
    
    .delete('/:plSongId', ensureAuth, respond(
        ({ id, plSongId, user }) => Playlist.removePlSong(id, plSongId, user)
    ));