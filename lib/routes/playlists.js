
const router = require('express').Router();
const Playlist = require('../models/Playlist');
const { getParam, respond } = require('./route-helpers');
const songs = require('./pl-songs');

module.exports = router

    .param('id', getParam)

    .post('/', respond(
        ({ body }) => {
            return Playlist.create(body);
        }
    ))

    .put('/:id', respond(
        ({ id, body, }) => {
            return Playlist.updateById(id, body);
        }
    ))

    .get('/:id', respond(
        ({ id }) => Playlist.getDetailById(id)
    ))

    .get('/', respond(
        ({ query }) => Playlist.findByQuery(query)
    ))
    
    .delete('/:id', respond(
        ({ id }) => Playlist.removeById(id)
            .then(deleted => {
                return { removed: !!deleted };
            })
    ))

    .use('/:id/pl-songs', songs);