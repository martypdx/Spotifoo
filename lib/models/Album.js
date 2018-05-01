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
                .populate({
                    path: 'artist',
                    select: 'name'
                })
                .populate({
                    path: 'tracklist',
                    select: 'title length'
                })
                .lean()
                // .populate({ path: 'artist', select: 'name' })
        ])
            .then(([album]) => {
                if(!album) return null;
                return album;
            });
    },

    findByQuery(query) {
        return this.find(query)
            .lean()
            .select(' __v title');
    },

    removeById(id) {
        return this.findOneAndRemove({
            _id: id
        });
    }
};

module.exports = mongoose.model('Album', schema);