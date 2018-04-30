const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');
const Artist = require('./Artist');
const Album = require('./Album');

const schema = new Schema({
    title: RequiredString,
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'Artist'
    },
    length: RequiredString,
    album: {
        type: Schema.Types.ObjectId,
        ref: 'Album'
    },
    playcount: Number
});

module.exports = mongoose.model('Song', schema);

