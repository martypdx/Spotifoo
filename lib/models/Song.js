const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');
const Album = require('./Album');

const schema = new Schema({
    title: RequiredString,
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'Artist'
    },
    length: RequiredString,
    playcount: Number
});

schema.statics = {

    getDetailById(id) {
        return Promise.all([
            this.findById(id)
                .populate({
                    path: 'artist',
                    select: 'name genre'
                })
                .lean(),

            Album.find({ tracklist: id })
                .lean()
                .select('title length')
        ])
            .then(([song, album]) => {
                if(!song) return null;
                song.album = album;
                return song;
            });
    },

    findByQuery(query) {
        return this.find(query)
            .lean()
            .select('title artist length playcount');
    },

    removeById(id) {
        return this.findOneAndRemove({
            _id: id
        });
    },
    
    increasePlaycount(id) {
        return this.findById(id)
            .then((song) => {
                song.playcount = song.playcount + 1;
                return song.save();
            });   
    },
    topSongs() {
        return this.aggregate([
            { $group: { _id: '$_id', Title: { $first: '$title' }, Plays: { $first: '$playcount' } } },
            { $sort: { Plays: -1 } }
        ]);
    }

};

module.exports = mongoose.model('Song', schema);

