const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');

const artistSchema = new Schema ({
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

module.exports = mongoose.model('Artist', artistSchema); 
