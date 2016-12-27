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
      let homeTweets = user.followingPosts;
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
    const userEmail = request.payload.sender;
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
    User.findOne({ email: userEmail }).then(sender => {
      let userPosts = [];
      userPosts = sender.posts;
      const tweet = new Tweet(request.payload);
      tweet.sender = sender.id;
      now = new Date();
      tweet.date = dateFormat(now, 'ddd, mmm dS, yyyy, h:MM:ss TT');

      //guard against null exception
      if (request.payload.text == '') {
        tweet.text = 'null';
      }

      tweet.save();
      userPosts.push(tweet.id);
      return sender.save();
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
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(foundUser => {
      let userTweets = foundUser.posts;
      tweetId.forEach(tweet => {//loop through selected tweets and
        userTweets.remove(tweet);//remove each selected tweet from users posts
        foundUser.save();
      });
      return Tweet.remove({ _id: { $in: tweetId } });
    }).then(response => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*/!*
 Facilitates deleting a specific tweet from home timeline
 *!/
exports.deleteHomeTweet = {
  handler: function (request, reply) {
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(sender => {
      let userTweets = sender.posts;
      let tweetsId = request.payload.tweet;
      return tweetsId.forEach(tweetId => {
        const foundUserId = foundUser.id;
        usersIdList.push(foundUserId);//store all user Ids in an array
      });
    }).then(response => {
      let tweetsId = request.payload.tweet;
      return Tweet.remove({ _id: { $in: tweetsId } });
    }).then(response => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};*/

/*
Facilitates deleting all tweets
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

/*
Facilitates deleting a specific user all tweets
 */
exports.userDeleteTweetsAll = {
  handler: function (request, reply) {
      const userEmail = request.auth.credentials.loggedInUser;
      User.findOne({ email: userEmail }).then(user => {
        const userId = user.id;
        return Tweet.remove({ sender: userId });
      }).then(allTweets => {
        reply.view('home', {
          title: 'MyTweet Home',
          _id: 'home',
        });
      }).catch(err => {
        reply.redirect('/');
      });
    },
};
