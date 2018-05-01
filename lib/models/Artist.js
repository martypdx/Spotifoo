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
        enum: ['Pop', 'Rock', 'Alternative', 'Blues', 'Indie', 'Musical', 'Classical', 'Electronic', 'Christian', 'Jazz', 'Vocal', 'Country', 'Dance', 'Hip-Hop', 'Rap', 'R&B/Soul', 'Folk', 'Soundtrack', 'Instrumental', 'World', 'Latin', 'Reggae']
    }
});

schema.statics = {
    getDetailById(id) {
        return Promise.all([
            this.findById(id)
                .populate({
                    path: 'albums',
                    select: 'title length'
                })
                .lean()
        ])
            .then(([artist]) => {
                if(!artist) return null;
                return artist;
            });
    },

    findByQuery(query) {
        return this.find(query)
            .lean()
            .select(' __v name');
    },

    removeById(id) {
        return this.findOneAndRemove({
            _id: id
        });
    }
};

module.exports = mongoose.model('Artist', schema); 
