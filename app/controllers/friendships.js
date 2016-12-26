'use strict';

const User = require('../models/user');
const Joi = require('joi');

exports.follow = {
  handler: function (request, reply) {
    let sourceUserFollowing = [];
    let targetUserFollowedBy = [];
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(sourceUser => {
        sourceUserFollowing = sourceUser.following;
        const sourceUserId = sourceUser.id;
        const targetUserId = request.payload.targetUser;
        if ((sourceUserId !== targetUserId) && (sourceUserFollowing.indexOf(targetUserId) === -1)) {
          sourceUserFollowing.push(targetUserId);//add target user to source user following array

          User.findOne({ _id: targetUserId }).then(targetUser => {
            targetUserFollowedBy = targetUser.followedBy;
            if ((sourceUserId !== targetUserId) && (targetUserFollowedBy.indexOf(sourceUserId) === -1)) {
              targetUserFollowedBy.push(sourceUserId);//add source user to target user followed by array
            } else {
              console.log('Already followed by this user');
            }

            sourceUser.save();
            return targetUser.save();
          });
        } else {
          console.log('Already following this user');
        };
      }).then(response => {
        reply.redirect('/home');
      }).catch(err => {
        reply.redirect('/home');
      });
  },
};
