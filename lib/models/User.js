const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const { RequiredString } = require('../util/mongoose-helpers');

const schema = new Schema({
    name: RequiredString,
    email: RequiredString,
    hash: RequiredString,
    role: RequiredString,
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    playlists: [{
        type: Schema.Types.ObjectId,
        ref: 'Playlist'
    }]
});

schema.methods = {
    generateHash(password) {
        this.hash = bcrypt.hashSync(password);
    },
    comparePassword(password) {
        return bcrypt.compareSync(password, this.hash);
    }
    // getDetailById(id) {
    //     return this.findById(id)
    //         .lean();
    //         .populate({
    //             path: 'playlist',
    //             select: 'name'
    //         })
    //         .populate({
    //             path: 'following',
    //             select: 'name'
    //         });
    // }
};

schema.statics = {
    getDetailById(id) {
        return this.findById(id)
            .lean()
            .select('name email following playlists')
            .populate({
                path: 'playlist',
                select: 'name'
            })
            .populate({
                path: 'following',
                select: 'name'
            });
    },
    getByQuery(query) {
        return this.find(query)
            .lean()
            .select('name email following playlists')
            .populate({
                path: 'playlist',
                select: 'name'
            })
            .populate({
                path: 'following',
                select: 'name'
            });
    }
};

module.exports = mongoose.model('User', schema);
