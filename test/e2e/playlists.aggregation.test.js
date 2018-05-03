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
        name: 'foo Bar'
    };

    let user2 = {
        email: 'boot@bar.com',
        password: 'bootbar',
        role: 'admin',
        name: 'Boot Bar'
    };

    let user3 = {
        email: 'doot@bar.com',
        password: 'dootbar',
        role: 'admin',
        name: 'doot Bar'
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

    const postPlaylist = (playlist, user) => {
        playlist.user = user._id;
        return request.post('/playlists')
            .set('Authorization', user.token)
            .send(playlist)
            .then(({ body }) => {
                playlist = body;
            });
    };

    before(() => postPlaylist(playlist1, user1));
    before(() => postPlaylist(playlist2, user1));
    before(() => postPlaylist(playlist3, user1));
    before(() => postPlaylist(playlist4, user2));
    before(() => postPlaylist(playlist5, user2));
    before(() => postPlaylist(playlist6, user3));
    before(() => postPlaylist(playlist7, user3));

    it('Sorts playlist by Playcount', () => {
        return request.get('/playlists/top')
            .then(response => {
                assert.equal(response.body[0].Name, 'playlist7');
                assert.equal(response.body[6].Name, 'playlist6');
            });
    });

    it('Sorts playlist by Playcount', () => {
        return request.get(`/playlists/user/${user1._id}`)
            .then(response => {
                assert.equal(response.body[0].Name, 'playlist4');
                assert.equal(response.body[6].Name, 'playlist1');
            });
    });
});