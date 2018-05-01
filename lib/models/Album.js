const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');
// const Artist = require('./Artist');
// const Song = require('./Song');

const schema = new Schema({
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'Artist'
    },
    title: RequiredString,
    length: RequiredString,
    tracklist: [{
        type: Schema.Types.ObjectId,
        ref: 'Song'
    }]
});

schema.statics = {

    getDetailById(id) {
        return Promise.all([
            this.findById(id)
                .lean()
        ])
            .then(([album]) => {
                if(!album) return null;
                return album;
            });
    }
};

module.exports = mongoose.model('Album', schema);