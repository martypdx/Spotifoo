const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.only('Artist E2E Test', () =>{
    before(() => dropCollection('albums'));
    before(() => dropCollection('artists'));

    let album1 = ({
        title: 'Hounds of Love',
        length: '40 minutes',
    });

    before(() => {
        return request.post('/albums')
            .send(album1)
            .then(({ body }) => {
                album1 = body;
            });
    });

    let artist1 = {
        name:'Kate Bush',
        albums:[],
        genre: 'Alternative'
    };

    // let artist2 = {
    //     name:'Grimes',
    //     genre: 'Pop'
    // };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    it('posts an artist to the db', () => {
        return request.post('/artists')
            .send(artist1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v, genre, albums } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.ok(genre);
                assert.deepEqual(body, {
                    ...artist1,
                    _id, __v, genre, albums
                });
                artist1 = body;
            });
    });



});