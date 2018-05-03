const router = require('express').Router();
const Playlist = require('../models/Playlist');
const { getParam, respond } = require('./route-helpers');
const createEnsureAuth = require('../util/ensure-auth');
const ensureAuth = createEnsureAuth();
const createEnsureRole = require('../util/ensure-role');
const ensureRole = createEnsureRole();

module.exports = router

    .param('plSongId', getParam)

    .post('/', ensureAuth, respond(
        ({ id, body }) => Playlist.addPlSong(id, body)
    ))
    
    .delete('/:plSongId', ensureAuth, respond(
        ({ id, plSongId }) => {
            return Playlist.removePlSong(id, plSongId);
        }));
