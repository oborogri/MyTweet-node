'use strict';

const User = require('../models/user');
const Boom = require('boom');

/*
Find all users
 */
exports.find = {

  auth: false,

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

  auth: false,

  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }).then(user => {
      reply(user);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/*
Delete one user with specific _id
 */
exports.deleteOne = {

  auth: false,

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

  auth: false,

  handler: function (request, reply) {
    const user = new User(request.payload);
    user.save().then(newUser => {
      reply(newUser).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating User'));
    });
  },

};

/*
Delete all users
 */
exports.deleteAll = {

  auth: false,

  handler: function (request, reply) {
    User.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Users'));
    });
  },

};
