'use strict';

const User = require('../models/user');
const Boom = require('boom');
const utils = require('./utils.js');
const bcrypt = require('bcrypt-nodejs');
const Joi = require('joi');

/*
 User authentication handler
 */
exports.authenticate = {
  //authentication route must remain unguarded to allow user login
  auth: false,
  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      //implementing sync comparison of 2 passwords
      if (bcrypt.compareSync(user.password, foundUser.password)) {
        const token = utils.createToken(foundUser);
        reply({ success: true, token: token }).code(201);
      } else {
        reply({ success: false, message: 'Authentication failed. User not found.' }).code(201);
      }
    }).catch(err => {
      reply(Boom.notFound('internal db failure'));
    });
  },
};

/*
 Find all users
 */
exports.find = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.find({}).exec().then(users => {
      reply(users);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

/*
 Find one user by _id
 */
exports.findOne = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }).then(user => {
      if (user != null) {
        reply(user);
      }

      reply(Boom.notFound('id not found'));
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

/*
 Delete one user with specific _id
 */
exports.deleteOne = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.remove({ _id: request.params.id }).then(user => {
      reply(user).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/*
 Create new user
 */
exports.createUser = {

  auth: {
    strategy: 'jwt',
  },

  plugins: {
    disinfect: {
      disinfectQuery: false,
      disinfectParams: false,
      disinfectPayload: false,
    },
  },

  handler: function (request, reply) {
    const user = new User(request.payload);
    const plaintextPassword = user.password;
    bcrypt.hash(plaintextPassword, null, null, function (err, hash) {
      user.password = hash;
      return user.save().then(newUser => {
        reply(newUser).code(201);
      }).catch(err => {
        reply(Boom.badImplementation('error creating User'));
      });
    });
  },
};

/*
 Delete all users
 */
exports.deleteAll = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Users'));
    });
  },
};
