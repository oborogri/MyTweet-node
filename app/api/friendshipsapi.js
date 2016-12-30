'use strict';

const Friendship = require('../models/friendship');
const Boom = require('boom');

/*
 Finds all friendships
 */
exports.find = {

  auth: false,

  handler: function (request, reply) {
    Friendship.find({})
        .populate('sourceUser')
        .populate('targetUser').then(friendships => {
      reply(friendships);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

/*
 Find one friendship by _id
 */
exports.findOne = {

  auth: false,

  handler: function (request, reply) {
    Friendship.findOne({ _id: request.params.id }).then(friendship => {
      if (friendship != null) {
        reply(friendship);
      }

      reply(Boom.notFound('id not found'));
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

/*
 Find a specific user's friendships following
 */
exports.userFollowing = {

  auth: false,

  handler: function (request, reply) {
    Friendship.find({ sourceUser: request.params.id }).then(friendships => {
      reply(friendships);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

/*
 Find a specific user's friendships followers
 */
exports.userFollowers = {

  auth: false,

  handler: function (request, reply) {
    Friendship.find({ targetUser: request.params.id }).then(friendships => {
      reply(friendships);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

/*
 Create new friendship
 */
exports.createFriendship = {

  auth: false,

  handler: function (request, reply) {
    const friendship = new FriendUser(request.payload);
    user.save().then(newUser => {
      reply(newUser).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating User'));
    });
  },
};

/*
 Delete one friendship by _id
 */
exports.deleteOne = {

  auth: false,

  handler: function (request, reply) {
    Friendship.remove({ _id: request.params.id }).then(friendship => {
      reply(friendship).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/*
 Delete one user's following
 */
exports.deleteUserFollowing = {

  auth: false,

  handler: function (request, reply) {
    Friendship.remove({ sourceUser: request.params.id }).then(friendships => {
      reply(friendships).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/*
 Delete one user's followers
 */
exports.deleteUserFollowers = {

  auth: false,

  handler: function (request, reply) {
    Friendship.remove({ targetUser: request.params.id }).then(friendships => {
      reply(friendships).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/*
 Delete all friendships
 */
exports.deleteAll = {

  auth: false,

  handler: function (request, reply) {
    Friendship.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Tweets'));
    });
  },

};
