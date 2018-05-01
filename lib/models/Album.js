const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');
const Artist = require('./Artist');

const schema = new Schema({
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
                    path: 'tracklist',
                    select: 'title length'
                })
                .lean(),

            Artist.find({ albums: id })
                .lean()
                .select('name genre')
        ])
            .then(([album, artist]) => {
                if(!album) return null;
                album.artist = artist;
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