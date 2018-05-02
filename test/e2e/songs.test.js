const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { verify } = require('../../lib/util/token-service');


describe('songs api', () => {

    before(() => dropCollection('users'));
    before(() => dropCollection('songs'));
    before(() => dropCollection('albums'));
    before(() => dropCollection('artists'));

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
        playcount: 3
    };

    let album1 = {
        title: 'album1',
        length: '2:02',
        tracklist: []
    };

    let artist1 = {
        name: 'artist1',
        genre: ['Rock']
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    before(() => {
        return request
            .post('/auth/signup')
            .send(user1)
            .then(({ body }) => {
                user1._id = verify(body.token).id;
                user1.token = body.token;
                console.log('Token: ' + body.token);
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

    it('saves a song', () => {
        song1.artist._id = artist1._id;
        return request.post('/songs')
            .set('Authorization', user1.token)
            .send(song1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.equal(body.artist, artist1._id);
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

    it('adds a song to an albums tracklist', () => {
        album1.tracklist.push(song1._id);
        return request.post('/albums')
            .set('Authorization', user1.token)
            .send(album1)
            .then(({ body }) => {
                album1 = body;
            });
    });

    it('gets a song by id', () => {
        return request.get(`/songs/${song1._id}`)
            .set('Authorization', user1.token)
            .then(({ body }) => {
                assert.deepEqual(body, {
                    _id: song1._id,
                    __v: 0, 
                    title: song1.title,
                    artist: {
                        _id: artist1._id,
                        name: artist1.name,
                        genre: artist1.genre
                    },
                    length: song1.length,
                    album: [{
                        _id: album1._id,
                        title: album1.title,
                        length: album1.length
                    }],
                    playcount: song1.playcount
                });
            });    
    });

    it('updates a songs playcount', () => {
        song1.playcount = song1.playcount + 1;
        return request.put(`/songs/${song1._id}`)
            .set('Authorization', user1.token)
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
            .set('Authorization', user1.token)
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