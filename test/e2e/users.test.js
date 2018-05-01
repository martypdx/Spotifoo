const { assert } = require('chai');
const request = require('./request');
const User = require('../../lib/models/User');
const { dropCollection, createToken } = require('./db');
const { verify } = require('../../lib/util/token-service');

describe.only('User E2E', () => {

    before(() => dropCollection('users'));
    before(() => dropCollection('playlists'));
    before(() => dropCollection('albums'));
    before(() => dropCollection('artists'));
    before(() => dropCollection('songs'));




    
    let user1 = {
        email: 'foo@bar.com',
        password: 'foobar',
        role: 'admin',
        name: 'Mr. Foo Bar'
    };

    let user2 = {
        email: 'food@bard.com',
        password: 'foodbard',
        role: 'admin',
        name: 'Mr. Food Bard'
    };

    let user3 = {
        email: 'foodie@bard.com',
        password: 'foodiebard',
        name: 'Mr. Foodie Bard',
        role: 'user'
    };

    let song1 = {
        title: 'song1',
        artist: {},
        length: '3:03',
        album: {},
        playcount: 3
    };

    let album1 = {
        // artist: {},
        title: 'album1',
        length: '2:02'
        // tracklist: [{}]
    };

    let artist1 = {
        name: 'artist1',
        // albums: [{}]
        genre: ['Rock']
    };

    let playlist1 = {
        name: 'playlist1',
        songs: [],
        user: {},
        playlistCount: 3
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
        return request
            .post('/auth/signup')
            .send(user3)
            .then(({ body }) => {
                user3._id = verify(body.token).id;
                user3.token = body.token;
            });
    });

    before(() => {
        return request.post('/albums')
            .send(album1)
            .then(({ body }) => {
                album1 = body;
            });
    });

    before(() => {
        return request.post('/artists')
            .send(artist1)
            .then(({ body }) => {
                artist1 = body;
            });
    });

    before(() => {
        song1.artist._id = artist1._id;
        song1.album._id = album1._id;
        return request.post('/songs')
            .send(song1)
            .then(({ body }) => {
                song1 = body;
            });
    });

    before(() => {
        playlist1.songs.push(song1._id);
        playlist1.user = user1._id;
        return request.post('/playlists')
            .send(playlist1)
            .then(checkOk)
            .then(({ body }) => {
                playlist1 = body;
                console.log(user3.playlists);
            });
    });

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };
   
    it('GET - a user by ID', () => {
        return request.get(`/users/${user1._id}`)
            .then(({ body }) => {
                assert.equal(body.name, user1.name);
                assert.equal(body.email, user1.email);
                assert.equal(body.playlists[0].name, playlist1.name);
                assert.equal(body.playlists[0]._id, playlist1._id);

            });
    });

    it('GET - all users', () => {
        return request.get('/users')
            .then(({ body }) => {
                console.log(body);
                assert.equal(body[0].name, user1.name);
                assert.equal(body[1].name, user2.name);
            });
    });

    it('PUT - Update a User - ADMIN ONLY', () => {
        user2.name = 'The New Guy';
        return request.put(`/users/${user2._id}`)
            .set('Authorization', user2.token)
            .send(user2)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.name, user2.name);
            });
    });
}); 