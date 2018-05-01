const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { Types } = require('mongoose');

describe.only('Album E2E route test', () => {

    before(() => dropCollection('artists'));
    before(() => dropCollection('albums'));

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    let artist1 = {
        name:'Radiation City',
        albums: [],
        genre: 'Alternative'
    };

    before(() => {
        return request.post('/artists')
            .send(artist1)
            .then(({ body }) => {
                artist1 = body;
            });
    });

    let album1 = {
        // artist: {},
        title: 'Synesthetica',
        length: '40min',
        tracklist: []
    };

    // let album2 = {
    //     //artist:{},
    //     title: 'Truth is a Beautiful Thing',
    //     length: '1hour 19min',
    //     //tracklist: [{}]
    // };

    it('posts an album to the db', () => {
        return request.post('/albums')
            .send(album1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    ...album1,
                    _id, __v
                });
                album1 = body;
            });
    });
});