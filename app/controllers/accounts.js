/**
 * Created by Grigore on 11/10/2016.
 */
'use strict';

const User = require('../models/user');
const Joi = require('joi');
var dateFormat = require('dateformat');
var now        = null;
const bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;

/*
Renders MyTweet welcome page
 */
exports.main = {
  auth: false,
  handler: function (request, reply) {
    reply.view('main', { title: 'Welcome to MyTweet' });
  },
};

/*
Renders user signup page
 */
exports.signup = {
  auth: false,
  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for MyTweet' });
  },
};

/*
Register new user
 */
exports.register = {
  auth: false,

  //payload data sanitized with disinfect module
  plugins: {
    disinfect: {
      disinfectQuery: true,
      disinfectParams: true,
      disinfectPayload: true,
    },
  },
  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(3).max(8).required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },

    options: {
      abortEarly: false,
    },
  },

  //password hashing handler
  handler: function (request, reply) {
    const user = new User(request.payload);
    now = new Date();
    user.joined = dateFormat(now, 'ddd, mmm dS, yyyy');
    const plaintextPassword = user.password;
    bcrypt.hash(plaintextPassword, null, null, function (err, hash) {
      user.password = hash;
      return user.save().then(newUser => {
        reply.redirect('/');
      }).catch(err => {
        reply.redirect('/');
      });
    });
  },
};

/*
User authentication
 */
exports.authenticate = {
  auth: false,

  //data validated with disinfect module
  plugins: {
    disinfect: {
      disinfectQuery: true,
      disinfectParams: true,
      disinfectPayload: true,
    },
  },

  //hapi validation with joy
  validate: {

    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('main', {
        title: 'Login error',
        errors: error.data.details,
      }).code(400);
    },

    options: {
      abortEarly: false,
    },
  },
  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      //implementing sync comparison of 2 passwords
      if (bcrypt.compareSync(user.password, foundUser.password)) {
        request.cookieAuth.set(
            {
              loggedIn: true,
              loggedInUser: user.email,
            });
        reply.redirect('/home');
      } else {
        reply.redirect('/');
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
User logout
 */
exports.logout = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },
};

/*
Renders update settings page
 */
exports.viewSettings = {
  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).populate('following').then(foundUser => {
      let followersList = foundUser.followedBy;
      let followingList = foundUser.following;
      reply.view('settings',
          { title: 'Edit Account Settings',
            user: foundUser,
            followers: followersList,
            following: followingList, });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
Update user settings
 */
exports.updateSettings = {

  //payload validated with disinfect module
  plugins: {
    disinfect: {
      disinfectQuery: true,
      disinfectParams: true,
      disinfectPayload: true,
    },
  },

  //hapi validation with joy
  validate: {

    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().min(3).max(8).required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('settings', {
        title: 'Settings update error',
        errors: error.data.details,
      }).code(400);
    },

    options: {
      abortEarly: false,
    },
  },

  handler: function (request, reply) {
    const editedUser = request.payload;
    const loggedInUserEmail = request.auth.credentials.loggedInUser;

    User.findOne({ email: loggedInUserEmail }).then(user => {
      user.email = editedUser.email;
      request.cookieAuth.clear();//clear session cookie for old user email
      const plaintextPassword = editedUser.password;
      bcrypt.hash(plaintextPassword, null, null, function (err, hash) {
        user.password = hash;
        return user.save();
      });

      return user.save();
    }).then(newUser => {
          request.cookieAuth.set({
            loggedIn: true, // set new cookie with updated email
            loggedInUser: newUser.email,
          });
          reply.redirect('/settings');
        }).catch(err => {
          reply.redirect('/');
        });
  },
};

/*
Upload user profile picture
TO DO - implementation
 */
exports.upload_picture = {
  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).populate('following').then(foundUser => {
      let followersList = foundUser.followedBy;
      let followingList = foundUser.following;
      reply.redirect('/settings');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};
