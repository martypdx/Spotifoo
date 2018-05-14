const router = require('express').Router();
const Album = require('../models/Album');
const { getParam, respond } = require('./route-helpers');
const createEnsureAuth = require('../util/ensure-auth');
const createEnsureRole = require('../util/ensure-role');
const ensureAuth = createEnsureAuth();
const ensureRole = createEnsureRole('admin');

module.exports = router

    .param('id', getParam)

    .post('/', ensureAuth, ensureRole, respond(
        ({ body }) => Album.create(body)
    ))

    // should be a query param on `get`
    .get('/alph', respond(() => Album.albumsByAlph()))

    .get('/:id', respond(
        ({ id }) => Album.getDetailById(id)
    ))

    .get('/', respond(
        ({ query }) => Album.findByQuery(query)
    ))

    .put('/:id', ensureAuth, ensureRole, respond(
        ({ id, body, }) => Album.updateById(id, body)
    ))

    .delete('/:id', ensureAuth, ensureRole, respond(
        ({ id }) => Album.removeById(id)
            .then(deleted => {
                return { removed: !!deleted };
            })
    ));