const { assert } = require('chai');
const request = require('./request');
const { dropCollection, createToken } = require('./db');
const { Types } = require('mongoose');

describe('Playlist API', () => {

    before(() => dropCollection('songs'));
    before(() => dropCollection('playlists'));

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    let song1 = {
        title: 'song1',
        // artist: {},
        length: '3:03',
        // album: {},
        playcount: 3
    };

    let playlist1 = {
        name: 'playlist1',
        songs: [],
        // user: {},
        playlistCount: 3
    };

    before(() => {
        return request.post('/songs')
            .send(song1)
            .then(({ body }) => {
                song1 = body;
            });
    });

    it('saves a playlist', () => {
        playlist1.songs.push(song1._id);

        return request.post('/playlists')
            .send(playlist1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    ...playlist1,
                    _id, __v 
                });
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
                        title: song1.title,
                        playcount: song1.playcount
                    }],
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


});