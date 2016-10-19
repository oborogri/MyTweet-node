/**
 * Created by Grigore on 11/10/2016.
 */
'use strict';

const User = require('../models/user');
const Tweet = require('../models/tweet');

exports.home = {
  handler: function (request, reply) {
    Tweet.find({}).populate('user').then(allTweets => {
      reply.view('home', {
        title: 'MyTweet Timeline',
        tweets: allTweets,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.newtweet = {
  handler: function (request, reply) {
    reply.view('newtweet', { title: 'New Tweet' });
  },

};

exports.posttweet = {
  auth: false,
  handler: function (request, reply) {
    const tweet = new Tweet(request.payload);
    tweet.date = new Date();
    tweet.save().then(newTweet => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/tweet');
    });
  },
};

