const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');
// const Artist = require('./Artist');
// const Album = require('./Album');

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
                .populate({
                    path: 'artists',
                    select: 'name genre'
                })
                .lean()
                //needs artist and album populate
        ])
            .then(([song]) => {
                if(!song) return null;
                return song;
            });
    },

    findByQuery(query) {
        return this.find(query)
            .lean()
            .select('title playcount');
    },

    removeById(id) {
        return this.findOneAndRemove({
            _id: id
        });
    }

};

module.exports = mongoose.model('Song', schema);

