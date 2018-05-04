const { assert } = require('chai');
const Artist = require('../../lib/models/Artist');
const { getErrors } = require('./helpers');
const { Types } = require('mongoose');

describe('Artist Unit Test', () => {

    it('model is valid', () => {
        const input = {
            name: 'Grimes',
            albums: [Types.ObjectId()],
            genre: 'Pop'    
        };

        const artist = new Artist(input);

        input._id = artist._id;
        assert.deepEqual(artist.toJSON(), input);
        assert.isUndefined(artist.validateSync());
    });

    it('if required field is empty throws error', () => {
        const artist = new Artist({});
        const errors = getErrors(artist.validateSync(), 2);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.genre.kind, 'required');
    });
});