const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { verify } = require('../../lib/util/token-service');

describe('Artist E2E Test', () =>{

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

    let album1 = {
        title: 'Hounds of Love',
        length: '40 minutes',
        tracklist: []
    };

    let song1 = {
        title: 'song1',
        length: '3:03',
        playcount: 3
    };

    let artist1 = {
        name: 'Kate Bush',
        albums: [],
        genre: 'Alternative'
    };

    let artist2 = {
        name: 'Grimes',
        albums: [],
        genre: 'Pop'
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
        return request.post('/songs')
            .set('Authorization', user1.token)
            .send(song1)
            .then(({ body }) => {
                song1 = body;
            });
    });

    before(() => {
        album1.tracklist.push(song1._id);
        return request.post('/albums')
            .set('Authorization', user1.token)
            .send(album1)
            .then(({ body }) => {
                album1 = body;
            });
    });

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };
    
    it('posts an artist to the db', () => {
        artist1.albums.push(album1._id);
        return request.post('/artists')
            .set('Authorization', user1.token)
            .send(artist1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    ...artist1,
                    _id, __v
                });
                artist1 = body;
            });
    });

    it('gets artist by id', () => {
        return request.get(`/artists/${artist1._id}`)
            .then(({ body }) => {
                assert.equal(body.albums[0].title, album1.title);
            });
    });

    it('get all artists', () => {
        return request.post('/artists')
            .set('Authorization', user1.token)
            .send(artist2)
            .then(checkOk)
            .then(({ body }) => {
                artist2 = body;
                return request.get('/artists');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body[0].albums[0]._id, album1._id);
            });
    });

    it('update an artist', () => {
        artist1.name = 'Bob Marley';
        return request.put(`/artists/${artist1._id}`)
            .set('Authorization', user1.token)
            .send(artist1)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, artist1);
                return request.get(`/artists/${artist1._id}`);
            })
            .then(({ body }) => {
                assert.equal(body.name, artist1.name);
            });
    });

    it('Deletes an artist by id', () => {
        return request.delete(`/artists/${artist2._id}`)
            .set('Authorization', user1.token)
            .then(() => {
                return request.get(`/artists/${artist2._id}`);
            }) 
            .then(res => {
                assert.equal(res.status, 404);
            });
    });
});