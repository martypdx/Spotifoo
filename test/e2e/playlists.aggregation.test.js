const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { verify } = require('../../lib/util/token-service');

describe('Playlist Aggregation', () => {

    before(() => dropCollection('songs'));
    before(() => dropCollection('playlists'));
    before(() => dropCollection('albums'));
    before(() => dropCollection('artists'));
    before(() => dropCollection('users'));

    // const checkOk = res => {
    //     if (!res.ok) throw res.error;
    //     return res;
    // };

    let song1 = {
        title: 'song1',
        artist: {},
        length: '3:03',
        album: {},
        playcount: 3
    };

    let artist1 = {
        name: 'artist1',
        genre: ['Rock']
    };

    let album1 = {
        title: 'album1',
        length: '2:02'
    };

    let playlist1 = {
        name: 'playlist1',
        songs: [],
        user: {},
        playlistCount: 2
    };


    let playlist2 = {
        name: 'playlist2',
        songs: [],
        user: {},
        playlistCount: 3
    };

    let playlist3 = {
        name: 'playlist3',
        songs: [],
        user: {},
        playlistCount: 20
    };

    let playlist4 = {
        name: 'playlist4',
        songs: [],
        user: {},
        playlistCount: 10
    };

    let playlist5 = {
        name: 'playlist5',
        songs: [],
        user: {},
        playlistCount: 7
    };

    let playlist6 = {
        name: 'playlist6',
        songs: [],
        user: {},
        playlistCount: 1
    };

    let playlist7 = {
        name: 'playlist7',
        songs: [],
        user: {},
        playlistCount: 200
    };

    let user1 = {
        email: 'foo@bar.com',
        password: 'foobar',
        role: 'admin',
        name: 'Mr. Foo Bar'
    };

    let user2 = {
        email: 'boo@bar.com',
        password: 'boodbar',
        role: 'user',
        name: 'Mr. Bood Bar'
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
        return request
            .post('/auth/signup')
            .send(user2)
            .then(({ body }) => {
                user2._id = verify(body.token).id;
                user2.token = body.token;
            });
    });

    before(() => {
        return request.post('/albums')
            .set('Authorization', user1.token)
            .send(album1)
            .then(({ body }) => {
                album1 = body;
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
        playlist1.user = user1._id;
        return request.post('/playlists')
            .set('Authorization', user1.token)
            .send(playlist1)
            .then(({ body }) => {
                playlist1 = body;
            });
    });

    before(() => {
        playlist2.user = user1._id;
        return request.post('/playlists')
            .set('Authorization', user1.token)
            .send(playlist2)
            .then(({ body }) => {
                playlist2 = body;
            });
    });

    before(() => {
        playlist3.user = user1._id;
        return request.post('/playlists')
            .set('Authorization', user1.token)
            .send(playlist3)
            .then(({ body }) => {
                playlist3 = body;
            });
    });

    before(() => {
        playlist4.user = user1._id;
        return request.post('/playlists')
            .set('Authorization', user1.token)
            .send(playlist4)
            .then(({ body }) => {
                playlist4 = body;
            });
    });

    before(() => {
        playlist5.user = user1._id;
        return request.post('/playlists')
            .set('Authorization', user1.token)
            .send(playlist5)
            .then(({ body }) => {
                playlist5 = body;
            });
    });

    before(() => {
        playlist6.user = user1._id;
        return request.post('/playlists')
            .set('Authorization', user1.token)
            .send(playlist6)
            .then(({ body }) => {
                playlist6 = body;
            });
    });

    before(() => {
        playlist7.user = user1._id;
        return request.post('/playlists')
            .set('Authorization', user1.token)
            .send(playlist7)
            .then(({ body }) => {
                playlist7 = body;
            });
    });

    before(() => {
        song1.artist._id = artist1._id;
        song1.album._id = album1._id;
        return request.post('/songs')
            .set('Authorization', user1.token)
            .send(song1)
            .then(({ body }) => {
                song1 = body;
            });
    });

    it('Sorts playlist by Playcount', () => {
        return request.get('/playlists/top')
            .then(response => {
                assert.equal(response.body[0].Name, 'playlist7');
                assert.equal(response.body[6].Name, 'playlist6');
            });


    });







});