const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');
// const Song = require('./Song');
// const User = require('./User');

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

    getDetailById(id) {
        return Promise.all([
            this.findById(id)
                .populate({
                    path: 'songs',
                    populate: {
                        path: 'artist',
                        select: 'name'
                    }
                })
                .populate({
                    path: 'user',
                    select: 'name'
                })
                .lean()
        ])
            .then(([playlist]) => {
                if(!playlist) return null;
                return playlist;
            });
    },

    findByQuery(query) {
        return this.find(query)
            .lean()
            .select('name playlistCount');
    },

    removeById(id) {
        return this.findOneAndRemove({
            _id: id
        });
    }

};

module.exports = mongoose.model('Playlist', schema);