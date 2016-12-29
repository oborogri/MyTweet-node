/**
 * Created by Grigore on 11/10/2016.
 */
'use strict';

const User     = require('../models/user');
const Tweet    = require('../models/tweet');
const Joi = require('joi');
var dateFormat = require('dateformat');
var now        = null;
var url = require('url');

/*
Renders logged in user's timeline as home page
 */
exports.home = {
  handler: function (request, reply) {
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(user => {
      const userId = user.id;//finds loggedInUser id
      return User.find({ $or: [{ _id: userId }, { followedBy: userId }] });//finds user and their friends
    }).then(allUsers => {
      let usersIdList = [];
      allUsers.forEach(foundUser => {
        const foundUserId = foundUser.id;
        usersIdList.push(foundUserId);//store all user Ids in an array
      });
      return usersIdList;
    }).then(usersIdList => {
      console.log(usersIdList.length);
      return Tweet.find({ sender: { $in: usersIdList } }).populate('sender');//finds tweets of all users in friendship
    }).then(allTweets => {
      reply.view('home', {
        title: 'MyTweet Home',
        tweets: allTweets,
        _id: 'home',
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
Renders all users timeline
 */
exports.global_timeline = {
  handler: function (request, reply) {
    Tweet.find({}).populate('sender').then(allTweets => {
        reply.view('users_timeline', {
          title: 'MyTweet Timeline',
          tweets: allTweets,
          _id: 'timeline',
        });
      }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
Renders specific users timeline
 */
exports.user_timeline = {
  handler: function (request, reply) {
    const userEmail = request.payload.email;
    User.findOne({ email: userEmail }).then(user => {
      const userId = user.id;
      return Tweet.find({ sender: userId }).populate('sender');
    }).then(allTweets => {
      reply.view('user_timeline', {
        title: 'User Timeline',
        tweets: allTweets,
        _id: 'user_timeline',
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
Renders create new tweet view
 */
exports.newtweet = {
  handler: function (request, reply) {
    reply.view('newtweet', { title: 'New Tweet' });
  },

};

/*
Creates and posts a new tweet to the timeline
 */
exports.posttweet = {

  validate: {

    payload: {
      text: Joi.string().required(),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      Tweet.find({}).then(tweetsAll => {
        reply.view('newtweet', {
          title: 'Message can\'t be blanc!',
          tweets: tweetsAll,
          errors: error.data.details,
        }).code(400);
      }).catch(err => {
        reply.redirect('/home');
      });
    },
  },

  handler: function (request, reply) {
    const userEmail = request.auth.credentials.loggedInUser;
    let tweet = new Tweet(request.payload);
    now = new Date();
    tweet.date = dateFormat(now, 'ddd, mmm dS, yyyy, h:MM:ss TT');

    //guard against null exception
    if (request.payload.text == '') {
      tweet.text = 'null';
    }

    User.findOne({ email: userEmail }).then(foundUser=> {
      let userTweets = foundUser.posts;
      userTweets.push(tweet);//add tweet object to users posts list
      foundUser.save();
      tweet.sender = foundUser.id;
      tweet.save();
    }).then(NewTweet => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
 Facilitates deleting a specific tweet
 */
exports.deleteTweet = {
  handler: function (request, reply) {
    const tweetId = request.payload.tweet;//payload may contain multiple tweets
    let selectedTweets = [];
    if (typeof tweetId === 'object') {//payload contains an array of tweets ids
      selectedTweets.push.apply(selectedTweets, tweetId);
    } else {//payload contains just a single tweet id
      selectedTweets.push(tweetId);//insert payload into a new array
    }

    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(foundUser => {
      let userTweets = foundUser.posts;
      selectedTweets.forEach(tweet => {//looping through the payload ids
        for (var i = 0; i < userTweets.length; i++) {
          if (userTweets[i] == tweet) {
            userTweets.splice(i, 1);//deleting selected ids from user's posts list
          }
        }
      });
      foundUser.save();
      return Tweet.remove({ _id: { $in: tweetId } });//deleting tweets from db
    }).then(response => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
 Facilitates deleting a specific users all tweets
 */
exports.userDeleteTweetsAll = {
  handler: function (request, reply) {
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(user => {
      const userId = user.id;
      user.posts = [];//clearing user posts list
      user.save();
      return Tweet.remove({ sender: userId });
    }).then(response => {
      reply.view('home', {
        title: 'MyTweet Home',
        _id: 'home',
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

