const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { verify } = require('../../lib/util/token-service');

describe('Song Aggregation', () => {

    before(() => dropCollection('users'));
    before(() => dropCollection('albums'));
    before(() => dropCollection('artists'));
    before(() => dropCollection('songs'));

    let user1 = {
        email: 'foo@bar.com',
        password: 'foobar',
        role: 'admin',
        name: 'Mr. Foo Bar'
    };

    let song1 = {
        title: 'song1',
        artist: {},
        length: '3:03',
        playcount: 35
    };

    let song2 = {
        title: 'song2',
        artist: {},
        length: '3:03',
        playcount: 3
    };

    let song3 = {
        title: 'song3',
        artist: {},
        length: '3:03',
        playcount: 10
    };

    let song4 = {
        title: 'song4',
        artist: {},
        length: '3:03',
        playcount: 33
    };

    let song5 = {
        title: 'song5',
        artist: {},
        length: '3:03',
        playcount: 100
    };

    let artist1 = {
        name: 'artist1',
        genre: ['Rock']
    };

    before(() => {
        return request
            .post('/auth/signup')
            .send(user1)
            .then(({ body }) => {
                user1._id = verify(body.token).id;
                user1.token = body.token;
            });
    });

    before(() => {
        return request.post('/artists')
            .set('Authorization', user1.token)
            .send(artist1)
            .then(({ body }) => {
                artist1 = body;
            });
    });

    before(() => {
        song1.artist._id = artist1._id;
        return request.post('/songs')
            .set('Authorization', user1.token)
            .send(song1)
            .then(({ body }) => {
                song1 = body;
            });
    });

    before(() => {
        song2.artist._id = artist1._id;
        return request.post('/songs')
            .set('Authorization', user1.token)
            .send(song2)
            .then(({ body }) => {
                song2 = body;
            });
    });

    before(() => {
        song3.artist._id = artist1._id;
        return request.post('/songs')
            .set('Authorization', user1.token)
            .send(song3)
            .then(({ body }) => {
                song3 = body;
            });
    });

    before(() => {
        song4.artist._id = artist1._id;
        return request.post('/songs')
            .set('Authorization', user1.token)
            .send(song4)
            .then(({ body }) => {
                song4 = body;
            });
    });

    before(() => {
        song5.artist._id = artist1._id;
        return request.post('/songs')
            .set('Authorization', user1.token)
            .send(song5)
            .then(({ body }) => {
                song5 = body;
            });
    });

    it('Top Songs', () => {
        return request.get('/songs/top')
            .then(response => {
                assert.equal(response.body[0].Title, 'song5');
                assert.equal(response.body[4].Title, 'song2');
            });
    });

});