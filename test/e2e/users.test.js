const { assert } = require('chai');
const request = require('./request');
const User = require('../../lib/models/User');
const { dropCollection, createToken } = require('./db');
const { verify } = require('../../lib/util/token-service');

describe('User E2E', () => {

    before(() => dropCollection('users'));
    
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

    before(() => {
        return request
            .post('/auth/signup')
            .send(user1)
            .then(({ body }) => {
                user1._id = verify(body.token).id;
            });
    });

    before(() => {
        return request
            .post('/auth/signup')
            .send(user2)
            .then(({ body }) => {
                user2._id = verify(body.token).id;
            });
    });
   
    it('GET - a user by ID', () => {
        return request.get(`/users/${user1._id}`)
            .then(({ body }) => {
                assert.equal(body.name, user1.name);
                assert.equal(body.email, user1.email);
            });
    });

    it('GET - all users', () => {
        return request.get('/users')
            .then(({ body }) => {
                assert.equal(body[0].name, user1.name);
                assert.equal(body[1].name, user2.name);
            });
    });
}); 