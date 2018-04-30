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

    getDetailById(id) {
        return Promise.all([
            this.findById(id)
                .lean()
        ])
            .then(([crew]) => {
                if(!crew) return null;
                return crew;
            });
    },

    findByQuery(query) {
        return this.find(query)
            .lean()
            .select('title playcount');
    }

};

module.exports = mongoose.model('Song', schema);

