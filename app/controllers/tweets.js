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
    User.findOne({ email: userEmail }).populate('posts').then(user => {
      var tweetList = user.posts;//getting posts list from db
      const userId = user.id;
      User.find({ followedBy: userId }).populate('posts').then(allUsers => {
        allUsers.forEach(foundUser => {
          let foundUserId = foundUser.id;
          Tweet.find({ sender: foundUserId }).populate('sender').then(allTweets => {
            Array.prototype.push.apply(tweetList, allTweets);//adding friends tweets to posts list
            return user.save();
          });
        });
      });
      reply.view('home', {
        title: 'MyTweet Home',
        tweets: tweetList,
        id: 'home',
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
exports.home = {
  handler: function (request, reply) {
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(user => {
      const userId = user.id;
      return Friendship.find({ sourceUser: userId }).populate('sourceUser').populate('targetUser');
    }).then(allFriendships => {
      reply.view('home', {
        title: 'MyTweet Home',
        friendships: allFriendships,
        _id: 'home',
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};
*/

/*
Renders all global timeline
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
      var userTweets = sender.posts;
      const tweet = new Tweet(request.payload);
      tweet.sender = sender;
      now = new Date();
      tweet.date = dateFormat(now, 'ddd, mmm dS, yyyy, h:MM:ss TT');

      //guard against null exception
      if (request.payload.text == '') {
        tweet.text = 'null';
      }

      userTweets.push(tweet);
      sender.save();
      return tweet.save();
    }).then(newTweet => {
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
    let id = null;
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(sender => {
      sender.tweets -= 1;
      return sender.save();
    });
    id = request.payload.tweet;
    Tweet.remove({ _id: { $in: id } }).then(newTweet => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
Facilitates deleting all tweets
 */
exports.deleteTweetsAll = {
  handler: function (request, reply) {
    User.find({}).then(allUsers => {
      allUsers.forEach(user => {
        user.tweets = 0;
      });
      return user.save();
    });
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
        user.posts = 0;
        user.save();
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
