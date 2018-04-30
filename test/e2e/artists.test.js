const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Artist E2E Test', () =>{
    before(() => dropCollection('albums'));
    before(() => dropCollection('artists'));

    let album1 = ({
        title: 'Hounds of Love',
        length: '40 minutes',
    });

    before(() => {
        return request.post('/albums')
            .send(album1)
            .then(({ body }) => {
                album1 = body;
            });
    });

    let artist1 = {
        name:'Kate Bush',
        genre: 'Alternative'
    };

    let artist2 = {
        name:'Grimes',
        genre: 'Pop'
    };

    // const checkOk = res => {
    //     if(!res.ok) throw res.error;
    //     return res;
    // };




});