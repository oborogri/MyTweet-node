'use strict';

const Friendship = require('../models/friendship');
const Boom = require('boom');

/*
 Finds all friendships
 */
exports.findAllFriendships = {

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
 Find a specific user's friendships following
 */
exports.findUsersFollowing = {

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
exports.findUsersFollowers = {

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
 Find one friendship by _id
 */
exports.findOneById = {

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
 Delete one friendship by _id
 */
exports.deleteOneById = {

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
exports.deleteAllUsersFollowing = {

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
exports.deleteAllUsersFollowers = {

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
exports.deleteAllFriendships = {

  auth: false,

  handler: function (request, reply) {
    Friendship.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Tweets'));
    });
  },

};
