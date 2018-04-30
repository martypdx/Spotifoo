const router = require('express').Router();
const Artist = require('../models/Artist');
// const Album = require('../models/Album');
// const { updateOptions } = require('../util/mongoose-helpers');

// const check404 = (artist, id) => {
//     if(!artist) {
//         throw {
//             status: 404,
//             error: `no artist by id ${id}`
//         };
//     }
// };

module.exports = router
    .post('/', (req, res, next) => {
        Artist.create(req.body)
            .then(artist => res.json(artist))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Artist.findById(id)
            .lean()
            .then(artist => {
                res.json(artist);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Artist.find()
            .select('_id __v name')
            .then(artist => res.json(artist))
            .catch(next);


    });