const router = require('express').Router();
const Artist = require('../models/Artist');
const { getParam, respond } = require('./route-helpers');


module.exports = router


    .param('id', getParam)

    .post('/', respond(
        ({ body }) => {
            return Artist.create(body);
        }     
    ))

    .get('/:id', respond(
        ({ id }) =>  Artist.getDetailById(id)
        
    ))

    .get('/', respond(
        ({ query }) => Artist.findByQuery(query) 
    
    ))


    .put('/:id', respond(   
        ({ id, body, }) => {
            return Artist.updateById(id, body);
        }
    ))

    .delete('/:id', respond(    
        ({ id }) => Artist.removeById(id)
            .then(deleted => {
                return { removed: !!deleted };
            })
    ));
