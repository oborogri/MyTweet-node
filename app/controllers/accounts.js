/**
 * Created by Grigore on 11/10/2016.
 */
'use strict';

const User = require('../models/user');
const Admin = require('../models/admin');
const Joi = require('joi');
var dateFormat = require('dateformat');
var now        = null;

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
  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
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
  handler: function (request, reply) {
    const user = new User(request.payload);
    now = new Date();
    user.joined = dateFormat(now, 'ddd, mmm dS, yyyy');
    user.save().then(newUser => {
      reply.redirect('/');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/*
User authentication
 */
exports.authenticate = {
  auth: false,

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
    const userEmail = request.payload.email;
    const userPassword = request.payload.password;
    User.findOne({ email: userEmail }).then(foundUser => {
      if ((foundUser.email === userEmail) && (foundUser.password === userPassword)) {
        request.cookieAuth.set({
          loggedIn: true,
          loggedInUser: userEmail,
        });
        reply.redirect('/home');
      } else {
        console.log('Not a valid user!');
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
    User.findOne({ email: userEmail }).populate('followedBy').then(foundUser => {
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
  validate: {

    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
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
      user.password = editedUser.password;
      request.cookieAuth.clear();//clear session cookie for old user email
      return user.save();
    }).then(user => {
      request.cookieAuth.set({
        loggedIn: true, // set new cookie with updated email
        loggedInUser: user.email,
      });
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/');
    });
  },

};
