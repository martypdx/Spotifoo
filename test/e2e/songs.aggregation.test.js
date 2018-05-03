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
        title: 'A',
        artist: {},
        length: '4:03',
        playcount: 35
    };

    let song2 = {
        title: 'song2',
        artist: {},
        length: '6:03',
        playcount: 3
    };

    let song3 = {
        title: 'x',
        artist: {},
        length: '3:03',
        playcount: 10
    };

    let song4 = {
        title: 's',
        artist: {},
        length: '7:03',
        playcount: 33
    };

    let song5 = {
        title: 'song5',
        artist: {},
        length: '1:55',
        playcount: 100
    };

    let artist1 = {
        name: 'artist1',
        genre: ['Rock']
    };

    const postSongs = song => {
        song.artist._id = artist1._id;
        return request.post('/songs')
            .set('Authorization', user1.token)
            .send(song)
            .then(({ body }) => {
                song = body;
            });
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

    before(() => postSongs(song1));
    before(() => postSongs(song2));
    before(() => postSongs(song3));
    before(() => postSongs(song4));
    before(() => postSongs(song5));

    it('Top Songs', () => {
        return request.get('/songs/top')
            .then(response => {
                assert.equal(response.body[0].Title, 'song5');
                assert.equal(response.body[4].Title, 'song2');
            });
    });

    it('Songs by aplh', () => {
        return request.get('/songs/alph')
            .then(response => {
                assert.equal(response.body[0].Title, 'A');
                assert.equal(response.body[4].Title, 'x');
            });
    });

});