'use strict';

const Admin = require('../models/admin');
const User     = require('../models/user');
const Tweet    = require('../models/tweet');
const Friendship = require('../models/friendship');
const Joi = require('joi');
var dateFormat = require('dateformat');
var now        = null;

/*
Renders admin login page
 */
exports.admin_login = {
  auth: false,
  handler: function (request, reply) {
    reply.view('admin_login', { title: 'Log in as Administrator' });
  },
};

/*
 Admin authentication
 */
exports.admin_authenticate = {
  auth: false,

  //disinfect payload data with disinfect module
  plugins: {
    disinfect: {
      disinfectQuery: true,
      disinfectParams: true,
      disinfectPayload: true,
    },
  },

  //data payload validated with joy
  validate: {

    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('admin_login', {
        title: 'Login error',
        errors: error.data.details,
      }).code(400);
    },

    options: {
      abortEarly: false,
    },
  },
  handler: function (request, reply) {
    const admin = request.payload;
    Admin.findOne({ email: admin.email }).then(foundAdmin => {
      if (admin.password === 'adminkey' && admin.email === 'admin@wit.ie') {
        request.cookieAuth.set({
          loggedIn: true,
          loggedInUser: admin.email,
        });
        reply.redirect('/admin_timeline');
      } else {
        reply.redirect('/');
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
Renders specific users timeline in admin
 */
exports.adminUser_timeline = {
  handler: function (request, reply) {
    const userEmail = request.payload.email;
    User.findOne({ email: userEmail }).then(user => {
      const userId = user.id;
      return Tweet.find({ sender: userId }).populate('sender');
    }).then(allTweets => {
      reply.view('adminUser_timeline', {
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
Renders user profile view
 */
exports.user_profile = {
  handler: function (request, reply) {
    const foundEmail = request.payload.userEmail;
    User.findOne({ email: foundEmail })
        .populate('followedBy')
        .populate('posts')
        .populate('following')
        .then(user => {
      reply.view('user_profile',
          { title: 'User Profile',
            user: user,
            _id: 'userslist', });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
Renders admin signup page
 */
exports.admin_signup = {
  auth: false,
  handler: function (request, reply) {
    reply.view('admin_signup', { title: 'Create MyTweet admin account' });
  },
};

/*
Renders global admin timeline
 */
exports.admin_timeline = {
  handler: function (request, reply) {
    // instantiating a new object to store tweet statistics
    var stats = new Object();
    now = new Date();

    //finds total tweets count
    Tweet.count({ }, function (err, tweets) {
      stats.posts = tweets;
    });

    //finds all tweets in the last hour
    Tweet.count({ date: { $gt: now.getTime() - 1000 * 60 * 60 } }, function (err, tweets) {
      stats.postsHour = tweets;
    });

    //finds total tweet users count
    User.count({ }, function (err, users) {
      stats.users = users;
    });

    Tweet.find({}).populate('sender').then(allTweets => {
      reply.view('admin_timeline', {
        title: 'MyTweet Timeline',
        tweets: allTweets,
        _id: 'timeline',
        stats: stats,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
Facilitates admin deleting a specific tweet
 */
exports.adminDeleteTweet = {
  handler: function (request, reply) {
    let tweetId = request.payload.tweet;//selection may contain multiple tweets id
    let selectedTweets = [];
    if (typeof tweetId === 'object') {//payload contains an array of tweets ids
      selectedTweets.push.apply(selectedTweets, tweetId);
    } else {//payload contains just a single tweet id
      selectedTweets.push(tweetId);//insert payload into a new array
    }

    User.find({ posts: { $in: selectedTweets } }).then(allUsers => {
      allUsers.forEach(user => {//looping through all users
        selectedTweets.forEach(tweet => {//loop through the payload tweets ids
          for (var i = 0; i < user.posts.length; i++) {
            if (user.posts[i] == tweet) {
              user.posts.splice(i, 1);//deleting selected ids from user's posts list
              user.save();
            }
          }
        });
      });
      return Tweet.remove({ _id: { $in: tweetId } });//delete all selected tweets from db
    }).then(response => {
      reply.redirect('/admin_timeline');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
Facilitates deleting all tweets
 */
exports.adminDeleteTweetsAll = {
  handler: function (request, reply) {
    User.find({}).then(usersAll => {
      usersAll.forEach(user => {//clearing each users posts list
        user.posts = [];
        user.save();
      });
      return Tweet.remove({});//deleting tweets from db
    }).then(response => {
      reply.redirect('/admin_timeline', {
        title: 'MyTweet admin Timeline',
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
Renders all users list
 */
exports.userslist = {
  handler: function (request, reply) {
    // instantiating a new object to store tweet statistics
    var stats = new Object();
    now = new Date();

    //finds new users in the past week
    User.count({ date: { $gt: now.getTime() - 7 * 24 * 60 * 60 } }, function (err, users) {
      stats.usersWeek = users;
    });

    //finds total users count
    User.count({ }, function (err, users) {
      stats.users = users;
    });

    //finds total friendships count
    Friendship.count({ }, function (err, friendships) {
      stats.friendships = friendships;
    });

    User.find({}).then(allUsers => {
      reply.view('userslist', {
        title: 'MyTweet Users',
        users: allUsers,
        _id: 'userslist',
        stats: stats,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
Facilitates deleting a specific user and their tweets
 */
exports.deleteUser = {
  handler: function (request, reply) {
    let userId = request.payload.userId;
    Tweet.remove({ sender: { $in: userId } }).then(response => {
      console.log('User removed');
      return User.remove({ _id: { $in: userId } });
    }).then(response => {
          reply.redirect('/userslist');
        }).catch(err => {
      reply.redirect('/userslist');
    });
  },
};

/*
Renders add new User page
 */
exports.addUser = {
  auth: false,
  handler: function (request, reply) {
    reply.view('admin_new_user', { title: 'Register new user' });
  },
};

/*
Admin registers new user
 */
exports.register_user = {
  auth: false,
  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('admin_new_user', {
        title: 'Register error',
        errors: error.data.details,
      }).code(400);
    },

    options: {
      abortEarly: false,
    },
  },
  handler: function (request, reply) {
    const user = new User(request.payload);
    now = new Date();
    user.joined = dateFormat(now, 'ddd, mmm dS, yyyy');
    user.save().then(newUser => {
      reply.redirect('/userslist');
    }).catch(err => {
      reply.redirect('/admin_timeline');
    });
  },
};

/*
 Renders social graph page
 */
exports.social_graph = {
  handler: function (request, reply) {
    User.find({}).populate('followedBy').then(allUsers => {
      reply.view('social_graph', { title: 'MyTweet Social graph', users: allUsers });
    }).catch(err => {
      reply.redirect('/admin_timeline');
    });
  },
};
