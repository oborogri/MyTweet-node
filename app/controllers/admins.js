'use strict';

const Admin = require('../models/admin');
const User     = require('../models/user');
const Tweet    = require('../models/tweet');
const Joi = require('joi');
var dateFormat = require('dateformat');
var now        = null;

exports.dashboard = {
  handler: function (request, reply) {
    const adminEmail = request.auth.credentials.loggedInUser;
    reply.view('admin_home', {
        title: 'MyTweet Admin',
      });
  },
};
