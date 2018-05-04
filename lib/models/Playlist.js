const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');

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
            .select('name songs user playlistCount');
    },

    removeById(id, user) {
        return this.findById(id)
            .then((playlist) => {
                if(playlist.user != user.id) throw {
                    status: 403,
                    error: 'Not Authorized'
                };
                return this.findOneAndRemove({
                    _id: id
                });
            });  
    },

    addPlSong(id, body, user) {
        return this.findById(id)
            .then((playlist) => {
                if(playlist.user != user.id) throw {
                    status: 403,
                    error: 'Not Authorized'
                } ;
                return this.updateById(id, {
                    $push: { songs: body }
                });
            })
            .then(playlist => {
                if(!playlist) return null;
                return playlist.songs[playlist.songs.length - 1];
            });
    },

    removePlSong(id, plSongId, user) {
        return this.findById(id)
            .then((playlist) => {
                if(playlist.user != user.id) throw {
                    status: 403,
                    error: 'Not Authorized'
                };
                return this.updateById(id, {
                    $pull: { 
                        songs: plSongId
                    }
                });
            });
    },

    increasePlaycount(id) {
        return this.findById(id)
            .then((playlist) => {
                playlist.playlistCount = playlist.playlistCount + 1;
                return playlist.save();
            });   
    },

    topPlaylists() {
        return this.aggregate([
            { $group: { _id: '$_id', Name: { $first: '$name' }, Plays: { $first: '$playlistCount' } } },
            { $sort: { Plays: -1 } }
        ]);

    },

    updatePl(id, body, user) {
        return this.findById(id)
            .then((playlist) => {
                if(playlist.user != user.id) throw {
                    status: 403,
                    error: 'Not Authorized'
                } ;
                return this.updateById(id, body);
            });  
    },
  
    sortByUser() {
        return this.aggregate([
            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
            { $group: { _id: '$_id', Name: { $first: '$name' }, Plays: { $first: '$playlistCount' }, User: { $first: '$user.name' } } },
            { $sort: { User: 1, Plays: -1 } }
        ]);
    }

};

module.exports = mongoose.model('Playlist', schema);