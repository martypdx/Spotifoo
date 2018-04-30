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

    let artist2 = {
        name:'Grimes',
        albums:[],
        genre: 'Pop'
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    const getFields = ({ _id, __v, name }) => ({ _id, __v, name });

    it('posts an artist to the db', () => {
        return request.post('/artists')
            .send(artist1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    ...artist1,
                    _id, __v
                });
                artist1 = body;
            });
    });

    it('gets artist by id', () => {
        return request.get(`/artists/${artist1._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, artist1);
            });
    
    });

    it('get all artists', () => {
        return request.post('/artists')
            .send(artist2)
            .then(checkOk)
            .then(({ body }) => {
                artist2 = body;
                return request.get('/artists');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [artist1, artist2].map(getFields));
            });
    });
    
    it('update an artist', () => {
        artist1.name = 'Bob Marley';

        return request.put(`/artists/${artist1._id}`)
            .send(artist1)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, artist1);
                return request.get(`/artists/${artist1._id}`);
            })
            .then(({ body }) => {
                assert.equal(body.name, artist1.name);
            });

    });



});