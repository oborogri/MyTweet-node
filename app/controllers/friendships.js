'use strict';

const User = require('../models/user');
const Friendship = require('../models/friendship');
const Joi = require('joi');

exports.follow = {

  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    let friendship = new Friendship();
    User.findOne({ email: userEmail }).then(sourceUser => {
      friendship.sourceUser = sourceUser.id;
      sourceUser.following += 1;
      sourceUser.save();
      friendship.save();
      let target = request.payload.targetUser;
      return User.findOne({ _id: { $in: target } }).then(targetUser => {
        friendship.targetUser = targetUser.id;
        targetUser.followers += 1;
        targetUser.save();
        return friendship.save();
      }).then(response => {
        reply.redirect('/home');
      }).catch(err => {
        reply.redirect('/home');
      });
    });
  },
};

exports.report = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    Donation.find({}).populate('donor').populate('candidate').then(allDonations => {
      let total = 0;
      allDonations.forEach(donation => {
        total += donation.amount;
      });

      reply.view('report', {
        title: 'Donations to Date',
        donations: allDonations,
        total: total,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};
