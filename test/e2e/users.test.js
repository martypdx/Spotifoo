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

    let user3 = {
        email: 'foodie@bard.com',
        password: 'foodiebard',
        name: 'Mr. Foodie Bard',
        role: 'user'
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

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };
   
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