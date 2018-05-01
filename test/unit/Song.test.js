const { assert } = require('chai');
const { Types } = require('mongoose');
const Song = require('../../lib/models/Song');
const { getErrors } = require('./helpers');

describe('Song model', () => {
    
    it('valid good model', () => {
        const data = {
            title: 'song1',
            artist: Types.ObjectId(),
            length: '2:02',
            playcount: 3
        };

        const song = new Song(data);
        data._id = song._id;
        assert.deepEqual(song.toJSON(), data);
        assert.isUndefined(song.validateSync());
    });

    it('required fields', () => {
        const song = new Song({});
        const errors = getErrors(song.validateSync(), 2);
        assert.equal(errors.title.kind, 'required');
        assert.equal(errors.length.kind, 'required');
    });

});