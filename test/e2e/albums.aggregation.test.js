const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { verify } = require('../../lib/util/token-service');

describe('Albums aggregation tests', () => {

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

    let album1 = {
        title: 'a',
        length: '50:03',
        tracklist: []
    };
    let album2 = {
        title: 'e',
        length: '50:03',
        tracklist: []
    };
    let album3 = {
        title: 'c',
        length: '50:03',
        tracklist: []
    };
    let album4 = {
        title: 'y',
        length: '50:03',
        tracklist: []
    };
    let album5 = {
        title: 'z',
        length: '50:03',
        tracklist: []
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

    const postSongs = song => {
        song.artist._id = artist1._id;
        return request.post('/songs')
            .set('Authorization', user1.token)
            .send(song)
            .then(({ body }) => {
                song = body;
            });
    };

    const postAlbums = (album, song)  => {
        album.tracklist.push(song._id);
        return request.post('/albums')
            .set('Authorization', user1.token)
            .send(album)
            .then(({ body }) => {
                album = body;
            });
    };

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

    before(() => postAlbums(album1, song1));
    before(() => postAlbums(album2, song2));
    before(() => postAlbums(album3, song3));
    before(() => postAlbums(album4, song4));
    before(() => postAlbums(album5, song5));

    it('Albums by aplh', () => {
        return request.get('/albums/alph')
            .then(response => {
                assert.equal(response.body[0].Title, 'a');
                assert.equal(response.body[4].Title, 'z');
            });
    });

});