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
            .populate({
                path: 'tracklist',
                select: 'title length'
            })
            .lean()
            .select('title length tracklist');
    },

    removeById(id) {
        return this.findOneAndRemove({
            _id: id
        });
    },
    // albumsByTitle
    albumsByAlph() {
        // this isn't an aggregate, just a find
        // return this.aggregate([
        //     { $group: { _id: '$_id', Title: { $first: '$title' }, Length: { $first: '$length' } } },
        //     { $sort: { Title: 1 } }
        // ]);

        return this.find()
            .lean()
            .select('title length')
            .sort({ title: 1 });
    }
};

module.exports = mongoose.model('Album', schema);