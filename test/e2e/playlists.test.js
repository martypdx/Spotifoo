const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { verify } = require('../../lib/util/token-service');


describe.only('Playlist API', () => {

    before(() => dropCollection('songs'));
    before(() => dropCollection('playlists'));
    before(() => dropCollection('albums'));
    before(() => dropCollection('artists'));
    before(() => dropCollection('users'));

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    let song1 = {
        title: 'song1',
        artist: {},
        length: '3:03',
        album: {},
        playcount: 3
    };

    let album1 = {
        title: 'album1',
        length: '2:02'
    };

    let artist1 = {
        name: 'artist1',
        genre: ['Rock']
    };

    let playlist1 = {
        name: 'playlist1',
        songs: [],
        user: {},
        playlistCount: 3
    };

    let user1 = {
        email: 'foo@bar.com',
        password: 'foobar',
        role: 'admin',
        name: 'Mr. Foo Bar'
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
        return request.post('/albums')
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
        song1.artist._id = artist1._id;
        song1.album._id = album1._id;
        return request.post('/songs')
            .set('Authorization', user1.token)
            .send(song1)
            .then(({ body }) => {
                song1 = body;
            });
    });

    it('saves a playlist', () => {
        playlist1.songs.push(song1._id);
        playlist1.user = user1._id;
        return request.post('/playlists')
            .send(playlist1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.equal(body.name, playlist1.name);
                assert.equal(body.user, user1._id);
                playlist1 = body;
            });
    });

    const getFields = ({ _id, name, playlistCount }) => ({ _id, name, playlistCount });

    it('gets all playlists', () => {
        return request.get('/playlists')
            .then(({ body }) => {
                assert.deepEqual(body, [playlist1].map(getFields));
            });
    });

    it('gets a playlist by id', () => {
        return request.get(`/playlists/${playlist1._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, {
                    _id: playlist1._id,
                    __v: 0,
                    name: playlist1.name,
                    songs: [{
                        _id: song1._id,
                        __v: 0,
                        title: song1.title,
                        artist: {
                            _id: artist1._id,
                            name: artist1.name
                        },
                        length: song1.length,
                        playcount: song1.playcount
                    }],
                    user: { _id: user1._id, name: user1.name },
                    playlistCount: playlist1.playlistCount
                });
            });    
    });

    it('updates a playlists playcount an d the songs playcount as well', () => {
        playlist1.playlistCount = playlist1.playlistCount + 1;
        song1.playcount = song1.playcount + 1;
        return request.put(`/songs/${song1._id}`)
            .send(song1)
            .then(() => {
                return request.put(`/playlists/${playlist1._id}`)
                    .send(playlist1)
                    .then(checkOk)
                    .then(({ body }) => {
                        assert.deepEqual(body, playlist1);
                        return request.get(`/playlists/${playlist1._id}`);
                    })
                    .then(({ body }) => {
                        assert.equal(body.playlistCount, playlist1.playlistCount);
                    });
            });
    });

    it('deletes a playlist', () => {
        return request.delete(`/playlists/${playlist1._id}`)
            .then(() => {
                return request.get(`/playlists/${playlist1._id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });

    it('returns 404 with non-existent id', () => {
        return request.get(`/playlists/${playlist1._id}`)
            .then(response => {
                assert.equal(response.status, 404);
                assert.match(response.body.error, new RegExp(playlist1._id));
            });
    });


});