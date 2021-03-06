'use strict';

const Friendship = require('../models/friendship');
const Boom = require('boom');
const utils = require('./utils.js');

/*
 Finds all friendships
 */
exports.find = {

  auth: {
    strategy: 'jwt',
  },

  //disinfect the api query
  plugins: {
    disinfect: {
      disinfectQuery: true,
      disinfectParams: false,
      disinfectPayload: true,
    },
  },
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

  auth: {
    strategy: 'jwt',
  },

  //disinfect the api query
  plugins: {
    disinfect: {
      disinfectQuery: true,
      disinfectParams: false,
      disinfectPayload: true,
    },
  },
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

  auth: {
    strategy: 'jwt',
  },

  //disinfect the api query
  plugins: {
    disinfect: {
      disinfectQuery: true,
      disinfectParams: false,
      disinfectPayload: true,
    },
  },
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

  auth: {
    strategy: 'jwt',
  },

  //disinfect the api query
  plugins: {
    disinfect: {
      disinfectQuery: true,
      disinfectParams: false,
      disinfectPayload: true,
    },
  },
  handler: function (request, reply) {
    Friendship.find({ targetUser: request.params.id }).then(friendships => {
      reply(friendships);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

/*
 Delete one friendship by _id
 */
exports.deleteOne = {

  auth: {
    strategy: 'jwt',
  },

  //disinfect the api query
  plugins: {
    disinfect: {
      disinfectQuery: true,
      disinfectParams: false,
      disinfectPayload: true,
    },
  },
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

  auth: {
    strategy: 'jwt',
  },

  //disinfect the api query
  plugins: {
    disinfect: {
      disinfectQuery: true,
      disinfectParams: false,
      disinfectPayload: true,
    },
  },
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

  auth: {
    strategy: 'jwt',
  },

  //disinfect the api query
  plugins: {
    disinfect: {
      disinfectQuery: true,
      disinfectParams: false,
      disinfectPayload: true,
    },
  },
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

  auth: {
    strategy: 'jwt',
  },

  //disinfect the api query
  plugins: {
    disinfect: {
      disinfectQuery: true,
      disinfectParams: false,
      disinfectPayload: true,
    },
  },
  handler: function (request, reply) {
    Friendship.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Tweets'));
    });
  },

};

/*
 Create user following
 */
exports.createUserFollowing = {

  auth: {
    strategy: 'jwt',
  },

  //disinfect the api query
  plugins: {
    disinfect: {
      disinfectQuery: true,
      disinfectParams: false,
      disinfectPayload: true,
    },
  },
  handler: function (request, reply) {
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(foundUser => {
      const mainUserId = foundUser.id;
      const secondUserId = request.payload.id;
      const friendship = new Friendship();
      friendship.sourceUser = mainUserId;
      friendship.targetUser = secondUserId;
      friendship.save();
      reply(newFriendship).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating User'));
    });
  },

};