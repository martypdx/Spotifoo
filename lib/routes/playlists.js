const router = require('express').Router();
const Playlist = require('../models/Playlist');
const { getParam, respond } = require('./route-helpers');
const songs = require('./pl-songs');
const createEnsureAuth = require('../util/ensure-auth');
const ensureAuth = createEnsureAuth();

module.exports = router

    .param('id', getParam)

    .post('/', ensureAuth, respond(
        ({ body, user }) => {
            if(body.user != user.id) throw {
                status: 403,
                error: 'Not Authorized'
            } ;
            return Playlist.create(body);
        }
    ))

    .put('/:id', ensureAuth, respond(
        ({ id, body, user }) => Playlist.updatePl(id, body, user)
    ))

    .get('/top', respond(() => Playlist.topPlaylists()))

    .get('/user', respond(() => Playlist.sortByUser()))

    .get('/:id', respond(
        ({ id }) => Playlist.getDetailById(id)
    ))
    // "get" should never modify data. Use post or put
    .get('/play/:id', respond(
        ({ id }) => Playlist.increasePlaycount(id)
    ))

    .get('/', respond(
        ({ query }) => Playlist.findByQuery(query)
    ))
    
    .delete('/:id', ensureAuth, respond(
        ({ id, user }) => Playlist.removeById(id, user)
    ))
    // nice sub router!
    .use('/:id/pl-songs', songs);