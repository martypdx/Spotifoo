
const router = require('express').Router();
const Playlist = require('../models/Playlist');
const { getParam, respond } = require('./route-helpers');
const songs = require('./pl-songs');
const createEnsureAuth = require('../util/ensure-auth');
const ensureAuth = createEnsureAuth();
const createEnsureSameUser = require('../util/ensure-same-user');
const ensureSameUser = createEnsureSameUser();

module.exports = router

    .param('id', getParam)

    .post('/', ensureAuth, respond(
        ({ body }) => {
            return Playlist.create(body);
        }
    ))

    .put('/:id', ensureAuth, ensureSameUser, respond(
        ({ id, body, }) => {
            return Playlist.updateById(id, body);
        }
    ))

    .get('/top', respond(
        () => {
            return Playlist.topPlaylists();
        }
    ))

    .get('/:id', respond(
        ({ id }) => Playlist.getDetailById(id)
    ))

    .get('/', respond(
        ({ query }) => Playlist.findByQuery(query)
    ))
    
    .delete('/:userId/:id', ensureAuth, ensureSameUser, (req, res, next) => {
        Playlist.removeById(req.params.id)
            .then(deleted => {
                res.json({ removed: !!deleted });
            })
            .catch(next);
    })
    
    .use('/:id/pl-songs', songs);

