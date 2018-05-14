const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');

const schema = new Schema ({
    name: RequiredString,
    albums:[{
        type: Schema.Types.ObjectId,
        ref:'Album',
    }],
    genre: {
        ...RequiredString,
        // maybe put enum values in own file and import
        enum: ['Pop', 'Rock', 'Alternative', 'Blues', 'Indie', 'Musical', 'Classical', 'Electronic', 'Christian', 'Jazz', 'Vocal', 'Country', 'Dance', 'Hip-Hop', 'Rap', 'R&B/Soul', 'Folk', 'Soundtrack', 'Instrumental', 'World', 'Latin', 'Reggae']
    }
});

schema.statics = {
    getDetailById(id) {
        return this.findById(id)
            .populate({
                path: 'albums',
                select: 'title length'
            })
            .lean();
    },

    findByQuery(query) {
        return this.find(query)
            .populate({
                path: 'albums',
                select: 'title length'
            })
            .lean()
            .select('name albums genre');
    },

    removeById(id) {
        return this.findOneAndRemove({
            _id: id
        });
    },
    topGenres() {
        // okay! this one *is* and aggregate
        return this.aggregate([
            { $group : { _id : '$genre', Total : { $sum : 1 } } },
            { $sort : { Total : -1 } }
        ]);
    },
    // how about "byName"
    byAlph() {
        // just a find...
        return this.aggregate([
            { $group: { _id: '$_id', Name: { $first: '$name' }, Genre: { $first: '$genre' } } },
            { $sort: { Name: 1 } }
        ]);
    }
};

module.exports = mongoose.model('Artist', schema); 