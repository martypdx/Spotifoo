const router = require('express').Router();
const Playlist = require('../models/Playlist');
const { getParam, respond } = require('./route-helpers');

module.exports = router

    .param('plSongId', getParam)

    .post('/', respond(
        ({ id, body }) => Playlist.addPlSong(id, body)
    ))
    
    .delete('/:plSongId', respond(
        ({ id, plSongId }) => {
            console.log('ID', id);
            console.log('SONGID', plSongId);
            return Playlist.removePlSong(id, plSongId);
        }));
