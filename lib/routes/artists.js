const router = require('express').Router();
const Artist = require('../models/Artist');
const { getParam, respond } = require('./route-helpers');
const createEnsureAuth = require('../util/ensure-auth');
const createEnsureRole = require('../util/ensure-role');
const ensureAuth = createEnsureAuth();
const ensureRole = createEnsureRole('admin');

module.exports = router

    .param('id', getParam)

    .post('/', ensureAuth, ensureRole, respond(
        ({ body }) => Artist.create(body)
    ))

    .get('/topGenres', respond(() => Artist.topGenres()))

    // query param for normal get /
    .get('/alph', respond(() => Artist.byAlph()))

    .get('/:id', respond(
        ({ id }) =>  Artist.getDetailById(id)
    ))

    .get('/', respond(
        ({ query }) => Artist.findByQuery(query) 
    ))

    .put('/:id', ensureAuth, ensureRole, respond(   
        ({ id, body, }) => Artist.updateById(id, body)
    ))

    .delete('/:id', ensureAuth, ensureRole, respond(    
        ({ id }) => Artist.removeById(id)
            .then(deleted => {
                return { removed: !!deleted };
            })
    ));