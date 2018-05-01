const router = require('express').Router();
const Album = require('../models/Album');
const { getParam, respond } = require('./route-helpers');

module.exports = router

    .param('id', getParam)

    .post('/', respond(
        ({ body }) => {
            return Album.create(body);
        }
    ))

    .get('/:id', respond(
        ({ id }) => Album.getDetailById(id)

    ))

    .get('/', respond(
        ({ query }) => Album.findByQuery(query)

    ))


    .put('/:id', respond(
        ({ id, body, }) => {
            return Album.updateById(id, body);
        }
    ))

    .delete('/:id', respond(
        ({ id }) => Album.removeById(id)
            .then(deleted => {
                return { removed: !!deleted };
            })
    ));