
const router = require('express').Router();
const Song = require('../models/Song');
const { getParam, respond } = require('./route-helpers');

module.exports = router

    .param('id', getParam)

    .post('/', respond(
        ({ body }) => {
            return Song.create(body);
        }
    ))

    .put('/:id', respond(
        ({ id, body, }) => {
            return Song.updateById(id, body);
        }
    ))

    .get('/:id', respond(
        ({ id }) => Song.getDetailById(id)
    ))

    .get('/', respond(
        ({ query }) => Song.findByQuery(query)
    ));