const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');
const Song = require('./Song');
const User = require('./User');

const schema = new Schema({
    name: RequiredString,
    songs: [{
        type: Schema.Types.ObjectId,
        ref: 'Song'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    playlistCount: Number
});

schema.statics = {

    findByQuery(query) {
        return this.find(query)
            .lean()
            .select('name playlistCount');
    }

};

module.exports = mongoose.model('Playlist', schema);