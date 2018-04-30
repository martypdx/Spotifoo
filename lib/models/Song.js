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

schema.statics = {

    findByQuery(query) {
        return this.find(query)
            .lean()
            .select('title');
    }

};

module.exports = mongoose.model('Song', schema);

