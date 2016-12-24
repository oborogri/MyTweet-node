'use strict';

const Admin = require('../models/admin');
const User     = require('../models/user');
const Tweet    = require('../models/tweet');
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
Renders specific users timeline in admin
 */
exports.adminUser_timeline = {
  handler: function (request, reply) {
    const userEmail = request.payload.sender;
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
    User.findOne({ email: foundEmail }).populate('posts').then(user => {
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
Register new administrator
 */
exports.admin_register = {
  auth: false,
  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('admin_signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },

    options: {
      abortEarly: false,
    },
  },
  handler: function (request, reply) {
    const admin = new Admin(request.payload);
    admin.save().then(newAdmin => {
      reply.redirect('/admin_login');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
Admin authentication
 */
exports.admin_authenticate = {
  auth: false,

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
Renders global admin timeline
 */
exports.admin_timeline = {
  handler: function (request, reply) {
    Tweet.find({}).populate('sender').then(allTweets => {
      reply.view('admin_timeline', {
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
Facilitates admin deleting a specific tweet
 */
exports.adminDeleteTweet = {
  handler: function (request, reply) {
    const tweetId = request.payload.tweet;
    Tweet.remove({ _id: { $in: tweetId } }).then(allTweets => {
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
    User.find({}).then(allUsers => {
      allUsers.forEach(user => {
        user.tweets = 0;
      });
      return;
    });
    Tweet.remove(function (err, p) {
      if (err) {
        throw err;
      } else {
        console.log('No Of Tweets deleted:' + p);
      }
    }).then(allTweets => {
      reply.view('admin_timeline', {
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
    User.find({}).then(allUsers => {
      reply.view('userslist', {
        title: 'MyTweet Users',
        users: allUsers,
        _id: 'userslist',
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
    let id = request.payload.userId;
    User.findOne({ _id: { $in: id } }).then(foundUser => {
      let userId = foundUser.id;
      Tweet.remove({ sender: userId }).then(response => {
        User.remove({ _id: { $in: id } }).then(response => {
          reply.redirect('/userslist');
        });
      });
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
    User.find({}).then(allUsers => {
      reply.view('social_graph', { title: 'MyTweet Social graph', users: allUsers });
    }).catch(err => {
      reply.redirect('/admin_timeline');
    });
  },
};

