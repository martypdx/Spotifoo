const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { verify } = require('../../lib/util/token-service');

describe.only('Artists Aggregation', () => {

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

    let artist3 = {
        name: 'Bush',
        albums: [],
        genre: 'Rock'
    };

    let artist4 = {
        name: 'Preoccupations',
        albums: [],
        genre: 'Rock'
    };

    let artist5 = {
        name: 'Brittany Spears',
        albums: [],
        genre: 'Pop'
    };

    let artist6 = {
        name: 'Miley Cyrus',
        albums: [],
        genre: 'Pop'
    };

    let artist7 = {
        name: 'Nickelback',
        albums: [],
        genre: 'Alternative'
    };

    let artist8 = {
        name: 'Currency',
        albums: [],
        genre: 'Hip-Hop'
    };

    let artist9 = {
        name: 'ASAP Rocky',
        albums: [],
        genre: 'Hip-Hop'
    };

    let artist10 = {
        name: 'Joy Division',
        albums: [],
        genre: 'Rock'
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

    const postArtist = artist => {
        return request.post('/artists')
            .set('Authorization', user1.token)
            .send(artist)
            .then(({ body }) => {
                artist = body;
            });
    };

    before(() => postArtist(artist1));
    before(() => postArtist(artist2));
    before(() => postArtist(artist3));
    before(() => postArtist(artist4));
    before(() => postArtist(artist5));
    before(() => postArtist(artist6));
    before(() => postArtist(artist7));
    before(() => postArtist(artist8));
    before(() => postArtist(artist9));
    before(() => postArtist(artist10));

    it('Top Genres', () => {
        return request.get('/artists/topGenres')
            .then(({ body }) => {
                assert.equal(body[0].Total, 3);
                assert.equal(body[3].Total, 2);
            });
    });

    it('Artists Alphabetically', () => {
        return request.get('/artists/alph')
            .then(({ body }) => {
                assert.equal(body[0].Name, 'ASAP Rocky');
                assert.equal(body[9].Name, 'Preoccupations');
            });
    });

   


});