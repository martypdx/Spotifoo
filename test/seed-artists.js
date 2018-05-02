// const { dropCollection } = require('./db');
const mongoose = require('mongoose');
const { verify } = require('../lib/util/token-service');
const request = require('./e2e/request');
const connect = require('../lib/util/connect');

connect('mongodb://steele:spotifoo2018@ds263759.mlab.com:63759/heroku_6wchv1sp'); 

// dropCollection('songs');
// dropCollection('playlists');
// dropCollection('albums');
// dropCollection('artists');
// dropCollection('users');

function postUsers(user) {
    return request
        .post('/auth/signup')
        .send(user)
        .then(({ body }) => {
            user._id = verify(body.token).id;
            user.token = body.token;
        });
}

function postArtists(artist) {
    return request.post('/artists')
        .send(artist)
        .then(({ body }) => {
            artist = body;
        });
}

let user1 = {
    email: 'steele@steele.com',
    password: 'foobar',
    role: 'admin',
    name: 'Steele'
};

let artist1 = {
    name: 'London Grammar',
    albums: [],
    genre: ['Pop']
};
let artist2 = {
    name: 'Chairlift',
    albums: [],
    genre: ['Alternative']
};
let artist3 = {
    name: 'Kate Bush',
    albums: [],
    genre: ['Pop']
};
let artist4 = {
    name: 'Radiation City',
    albums: [],
    genre: ['Alternative']
};
let artist5 = {
    name: 'Bleachers',
    albums: [],
    genre: ['Alternative']
};
let artist6 = {
    name: 'Frou Frou',
    albums: [],
    genre: ['Electronic']
};
let artist7 = {
    name: 'Wye Oak',
    albums: [],
    genre: ['Folk']
};
let artist8 = {
    name: 'IAMX',
    albums: [],
    genre: ['Alternative']
};
let artist9 = {
    name: 'Shura',
    albums: [],
    genre: ['Alternative']
};
let artist10 = {
    name: 'Walk The Moon',
    albums: [],
    genre: ['Alternative']
};
let artist11 = {
    name: 'Preocupations',
    albums: [],
    genre: ['Alternative']
};
let artist12 = {
    name: 'Shame',
    albums: [],
    genre: ['Alternative']
};
let artist13 = {
    name: 'Oneohtrix Point Never',
    albums: [],
    genre: ['Alternative']
};
let artist14 = {
    name: 'Amen Dunes',
    albums: [],
    genre: ['Alternative']
};
let artist15 = {
    name: 'Institute',
    albums: [],
    genre: ['Alternative']
};
let artist16 = {
    name: 'Death Grips',
    albums: [],
    genre: ['Rap']
};
let artist17 = {
    name: 'Iceage',
    albums: [],
    genre: ['Alternative']
};
let artist18 = {
    name: 'CCFX',
    albums: [],
    genre: ['Alternative']
};
let artist19 = {
    name: 'B Boys',
    albums: [],
    genre: ['Alternative']
};
let artist20 = {
    name: 'DIIV',
    albums: [],
    genre: ['Alternative']
};
let artist21 = {
    name: 'Iron and Wine',
    albums: [],
    genre: ['Alternative']
};
let artist22 = {
    name: 'City and Colour',
    albums: [],
    genre: ['Rock']
};
let artist23 = {
    name: 'Emily Haines and the Soft Skeleton',
    albums: [],
    genre: ['Alternative']
};
let artist24 = {
    name: 'Typhoon',
    albums: [],
    genre: ['Alternative']
};
let artist25 = {
    name: 'Sufjan Stevens',
    albums: [],
    genre: ['Alternative']
};
let artist26 = {
    name: 'Frank Ocean',
    albums: [],
    genre: ['Hip-Hop']
};
let artist27 = {
    name: 'Mount Eerie',
    albums: [],
    genre: ['Alternative']
};
let artist28 = {
    name: 'Band of Horses',
    albums: [],
    genre: ['Rock']
};
let artist29 = {
    name: 'Taylor Swift',
    albums: [],
    genre: ['Pop']
};
let artist30 = {
    name: 'The Smiths',
    albums: [],
    genre: ['Pop']
};

function seedArtists() {
    postUsers(user1);
    postArtists(artist1);
    postArtists(artist2);
    postArtists(artist3);
    postArtists(artist4);
    postArtists(artist5);
    postArtists(artist6);
    postArtists(artist7);
    postArtists(artist8);
    postArtists(artist9);
    postArtists(artist10);
    postArtists(artist11);
    postArtists(artist12);
    postArtists(artist13);
    postArtists(artist14);
    postArtists(artist15);
    postArtists(artist16);
    postArtists(artist17);
    postArtists(artist18);
    postArtists(artist19);
    postArtists(artist20);
    postArtists(artist21);
    postArtists(artist22);
    postArtists(artist23);
    postArtists(artist24);
    postArtists(artist25);
    postArtists(artist26);
    postArtists(artist27);
    postArtists(artist28);
    postArtists(artist29);
    postArtists(artist30);
}

seedArtists();

mongoose.connection.close();


