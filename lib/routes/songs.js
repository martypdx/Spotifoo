
const router = require('express').Router();
const Song = require('../models/Song');
const { getParam, respond } = require('./route-helpers');
const createEnsureAuth = require('../util/ensure-auth');
const createEnsureRole = require('../util/ensure-role');
const ensureAuth = createEnsureAuth();
const ensureRole = createEnsureRole('admin');


module.exports = router

    .param('id', getParam)

    .post('/', ensureAuth, ensureRole, respond(
        ({ body }) => {
            return Song.create(body);
        }
    ))

    .put('/:id', ensureAuth, ensureRole, respond(
        ({ id, body, }) => {
            return Song.updateById(id, body);
        }
    ))

    .get('/:id', respond(
        ({ id }) => Song.getDetailById(id)
    ))

    .get('/play/:id', respond(
        ({ id }) =>{ 
            return Song.increasePlaycount(id);
           
        }))

    .get('/', respond(
        ({ query }) => Song.findByQuery(query)
    ))
    
    .delete('/:id', ensureAuth, ensureRole, respond(
        ({ id }) => Song.removeById(id)
            .then(deleted => {
                return { removed: !!deleted };
            })
    ));