const { assert } = require('chai');
const { Types } = require('mongoose');
const Playlist = require('../../lib/models/Playlist');
const { getErrors } = require('./helpers');

describe('Playlist model', () => {
    
    it('valid good model', () => {
        const data = {
            name: 'playlist1',
            songs: [Types.ObjectId()],
            user: Types.ObjectId(),
            playlistCount: 4
        };

        const playlist = new Playlist(data);
        data._id = playlist._id;
        assert.deepEqual(playlist.toJSON(), data);
        assert.isUndefined(playlist.validateSync());
    });

    it('required fields', () => {
        const playlist = new Playlist({});
        const errors = getErrors(playlist.validateSync(), 1);
        assert.equal(errors.name.kind, 'required');
    });
});