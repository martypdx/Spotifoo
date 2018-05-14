const router = require('express').Router();
const User = require('../models/User');
const { getParam, respond } = require('./route-helpers');
const createEnsureAuth = require('../util/ensure-auth');
const createEnsureRole = require('../util/ensure-role');
const ensureAuth = createEnsureAuth();
const ensureAdmin = createEnsureRole('admin');
const createEnsureSameUser = require('../util/ensure-same-user');
const ensureSameUser = createEnsureSameUser();

module.exports = router

    .param('id', getParam)

    .get('/:id', respond(
        ({ id }) => User.getDetailById(id)
    ))

    .get('/', respond(
        ({ query }) => User.getByQuery(query)
    ))
    // easier to read "what" role is required
    .put('/:id', ensureAuth, ensureAdmin, respond(
        ({ id, body }) => User.updateUserById(id, body)
    ))

    // use a "me" route to avoid having the userId specified.
    // then you don't need ensureSameUser, but nice solution w/o knowing about /me routes
    .post('/:userId/following', ensureAuth, ensureSameUser, (req, res, next) => {
        User.addFollower(req.params.userId, req.body)
            .then((follower) => {
                // Don't send text in a JSON API, make into an object
                res.send(`User ${follower} has been added to the Following list.`);
            })
            .catch(next);
    })

    .delete('/:userId/following/:removeId', ensureAuth, ensureSameUser, (req, res, next) => {
        User.removeFollower(req.params.userId, req.params.removeId)
            .then(() => {
                res.send(`User ${req.params.removeId} has been removed from the Following list.`);
            })
            .catch(next);
    })

    .delete('/:id', ensureAuth, ensureAdmin, (req, res, next) => {
        User.findByIdAndRemove(req.params.id)
            .then((body) => {
                res.send(`User ${body._id} has been deleted.`);
            })
            .catch(next);
    });