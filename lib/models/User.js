const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const { RequiredString } = require('../util/mongoose-helpers');
const Playlist = require('./Playlist');

const schema = new Schema({
    name: RequiredString,
    email: RequiredString,
    hash: RequiredString,
    role: RequiredString,
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const updateOptions = {
    new: true,
    runValidators: true
};

schema.methods = {
    generateHash(password) {
        this.hash = bcrypt.hashSync(password);
    },
    comparePassword(password) {
        return bcrypt.compareSync(password, this.hash);
    }
};

schema.statics = {
    getDetailById(id) {
        return Promise.all([

            this.findById(id)
                .lean()
                .select('name email following')
                .populate({
                    path: 'playlists',
                    select: 'name'
                })
                .populate({
                    path: 'following',
                    select: 'name'
                }),

            Playlist.find({ user: id })
                .lean()
                .select('name')

        ])
            .then(([user, playlists]) => {
                if(!user) return null;
                user.playlists = playlists;
                return user;
            });
    },
    getByQuery(query) {
        return this.find(query)
            .lean()
            .select('name email following')
            .populate({
                path: 'playlists',
                select: 'name'
            })
            .populate({
                path: 'following',
                select: 'name'
            });
    },
    updateUserById(id, update) {
        return this.findByIdAndUpdate(id, update, updateOptions)
            .select('name email following')
            .populate({
                path: 'playlists',
                select: 'name'
            })
            .populate({
                path: 'following',
                select: 'name'
            });
    },
    addFollower(id, body) {
        return this.updateById(id, {
            $push: { following: body }
        })
            .then(user => {
                if(!user) return null;
                return user.following[user.following.length - 1];
            });
    },
    removeFollower(id, follower) {
        return this.updateById(id, {
            $pull: {
                following: follower 
            }
        });
    }
};

module.exports = mongoose.model('User', schema);