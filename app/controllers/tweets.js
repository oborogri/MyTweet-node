/**
 * Created by Grigore on 11/10/2016.
 */
'use strict';

const User     = require('../models/user');
const Tweet    = require('../models/tweet');
var dateFormat = require('dateformat');
var now        = null;

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
    now = new Date();
    tweet.date = dateFormat(now, 'ddd, mmm dS, yyyy, h:MM:ss TT');
    tweet.save().then(newTweet => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/tweet');
    });
  },
};

/*
exports.deleteTweet = {
  handler: function (request, reply) {
    let id = request.params.id;
    Tweet.findOneAndRemove({ _id: id }).catch(err => {
      reply.redirect('/');
    });
  },
};
*/

exports.deleteTweetsAll = {
  handler: function (request, reply) {
    Tweet.remove(function (err, p) {
      if (err) {
        throw err;
      } else {
        console.log('No Of Tweets deleted:' + p);
      }
    }).then(allTweets => {
      reply.view('home', {
        title: 'MyTweet Timeline',
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};
