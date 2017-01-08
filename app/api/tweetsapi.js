'use strict';

const Tweet = require('../models/tweet');
const Boom = require('boom');
const utils = require('./utils.js');
/*
Find all tweets
 */
exports.findAllTweets = {

  //route guarded with jwt
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.find({}).populate('sender').then(tweets => {
      reply(tweets);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

/*
Find a specific user's tweets
 */
exports.findUsersTweets = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.find({ sender: utils.getUserIdFromRequest(request) }).then(tweets => {
      reply(tweets);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

/*
Find one tweet by _id
 */
exports.findOne = {

  auth: {
    strategy: 'jwt',
  },

  //payload data sanitized with disinfect module
  plugins: {
    disinfect: {
      disinfectQuery: true,
      disinfectParams: true,
      disinfectPayload: true,
    },
  },

  handler: function (request, reply) {
    Tweet.findOne({ _id: utils.getUserIdFromRequest(request) }).then(tweet => {
      if (tweet != null) {
        reply(tweet);
      }

      reply(Boom.notFound('id not found'));
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

/*
Delete one tweet by _id
 */
exports.deleteOneTweet = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.remove({ _id: request.params.id }).then(tweet => {
      reply(tweet).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/*
Create a new tweet and associate it with a specific user
 */
exports.createTweet = {

  auth: {
    strategy: 'jwt',
  },

  //payload data sanitized with disinfect module
  plugins: {
    disinfect: {
      disinfectQuery: true,
      disinfectParams: true,
      disinfectPayload: false,
    },
  },

  handler: function (request, reply) {
    const tweet = new Tweet(request.payload);
    tweet.sender = utils.getUserIdFromRequest(request);
    tweet.save().then(newTweet => {
      reply(newTweet).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating tweet'));
    });
  },

};

/*
Delete all tweets
 */
exports.deleteAllTweets = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Tweets'));
    });
  },

};

/*
Delete a specific user's tweets
 */

exports.deleteUsersTweets = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.remove({ sender: utils.getUserIdFromRequest(request) }).then(result => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Tweets'));
    });
  },
};
