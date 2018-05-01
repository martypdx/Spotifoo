const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('AUTH API', () => {

    beforeEach(() => dropCollection('users'));

    let token = null;

    beforeEach(() => {
        return request
            .post('/auth/signup')
            .send({
                email: 'foo@bar.com',
                password: 'foobar',
                role: 'admin',
                name: 'Mr. Foo Bar'
            })
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('Signup', () => {
        assert.ok(token);
    });

    it('Verifies', () => {
        return request
            .get('/auth/verify')
            .set('Authorization', token)
            .then(({ body }) => {
                assert.isOk(body.verified);
            });
    });

    it('Signin', () => {
        return request
            .post('/auth/signin')
            .send({
                email: 'foo@bar.com',
                password: 'foobar'
            })
            .then(({ body }) => {
                assert.ok(body.token);
            });
    });

    it('Gives 400 Error on Signup of Same Email', () => {
        return request
            .post('/auth/signup')
            .send({
                email: 'foo@bar.com',
                password: 'foobar',
                role: 'admin',
                name: 'Mrs. Foo Bar'
            })
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email Already Exists');
            });
    });

    it('Gives 401 Error on Non-Existent Email', () => {
        return request
            .post('/auth/signin')
            .send({
                email: 'bad@bar.com',
                password: 'fake'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid Email or Password');
            });
    });

    it('Gives 401 on Bad Password', () => {
        return request
            .post('/auth/signin')
            .send({
                email: 'foo@bar.com',
                password: 'bad'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid Email or Password');
            });
    });
});
