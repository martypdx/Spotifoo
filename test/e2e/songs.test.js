const { assert } = require('chai');
const request = require('./request');
const { dropCollection, createToken } = require('./db');
const { Types } = require('mongoose');

describe('songs api', () => {

    before(() => dropCollection('songs'));

    let song1 = {
        title: 'song1',
        // artist: {},
        length: '3:03',
        // album: {},
        playcount: 3
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    it('saves a song', () => {
        return request.post('/songs')
            .send(song1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    ...song1,
                    _id, __v
                });
                song1 = body;
            });
    });

    const getFields = ({ _id, title, playcount }) => ({ _id, title, playcount });

    it('gets all songs', () => {
        return request.get('/songs')
            .then(({ body }) => {
                assert.deepEqual(body, [song1].map(getFields));
            });
    });

    it('gets a song by id', () => {
        return request.get(`/songs/${song1._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, song1);
            });    
    });

    it('updates a songs playcount', () => {
        song1.playcount = song1.playcount + 1;
        return request.put(`/songs/${song1._id}`)
            .send(song1)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, song1);
                return request.get(`/songs/${song1._id}`);
            })
            .then(({ body }) => {
                assert.equal(body.playcount, song1.playcount);
            });
    });

    it('deletes a song', () => {
        return request.delete(`/songs/${song1._id}`)
            .then(() => {
                return request.get(`/songs/${song1._id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });

    it('returns 404 with non-existent id', () => {
        return request.get(`/songs/${song1._id}`)
            .then(response => {
                assert.equal(response.status, 404);
                assert.match(response.body.error, new RegExp(song1._id));
            });
    });
});