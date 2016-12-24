'use strict';

const User = require('../models/user');
const Joi = require('joi');

exports.follow = {
  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(sourceUser => {
      var sourceUserFollowing = sourceUser.following;
      var target = request.payload.targetUser;
      User.findOne({ _id: { $in: target } }).then(targetUser => {
        var targetUserFollowedBy = targetUser.followedBy;

        //check if user trying to follow themselves or an existing friend
        if ((sourceUser.id !== targetUser.id) && (sourceUserFollowing.indexOf(targetUser.id) === -1)) {
          sourceUserFollowing.push(targetUser.id);//add target user to following array
          targetUserFollowedBy.push(sourceUser.id);//add source user to followedBy array
        } else {
          console.log('Already following this user');
        }

        sourceUser.save();
        return targetUser.save();
      }).then(response => {
        reply.redirect('/home');
      }).catch(err => {
        reply.redirect('/home');
      });
    });
  },
};
