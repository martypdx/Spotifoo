const { assert } = require('chai');
const request = require('./request');
const User = require('../../lib/models/User');
const { dropCollection, createToken } = require('./db');

describe('User E2E', () => {

    before(() => dropCollection('users'));
   
    it('User Signs Up', () => {
        
    });
}); 